use ember_lib::core::pdf::{get_backend, PdfBackend};
use ember_lib::profiling::{
    end_internal_trace, ensure_profiling_enabled, profiling_end_trace, profiling_get_snapshot,
    profiling_reset, profiling_start_trace, start_internal_trace, ProfilingData, ProfilingStore,
};
use serde_json::{json, Value};
use std::{ffi::OsString, sync::Mutex};
use tauri::{
    test::{mock_builder, mock_context, noop_assets, MockRuntime},
    App, Builder, Manager,
};

const TEST_PDF: &str = "../tests/basic.pdf";
static ENV_LOCK: Mutex<()> = Mutex::new(());

struct EnvVarGuard {
    original_value: Option<OsString>,
}

impl EnvVarGuard {
    fn without_vite_profile() -> Self {
        let original_value = std::env::var_os("VITE_PROFILE");
        std::env::remove_var("VITE_PROFILE");
        Self { original_value }
    }
}

impl Drop for EnvVarGuard {
    fn drop(&mut self) {
        if let Some(value) = &self.original_value {
            std::env::set_var("VITE_PROFILE", value);
        } else {
            std::env::remove_var("VITE_PROFILE");
        }
    }
}

fn lock_env() -> std::sync::MutexGuard<'static, ()> {
    ENV_LOCK
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
}

fn setup() -> Box<dyn PdfBackend> {
    get_backend().expect("Failed to create backend")
}

fn create_profiling_app(builder: Builder<MockRuntime>) -> App<MockRuntime> {
    builder
        .manage(ProfilingStore::default())
        .build(mock_context(noop_assets()))
        .expect("failed to build profiling test app")
}

#[test]
fn test_load_pdf_metadata() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    assert!(document.metadata().page_count > 0);
}

#[test]
fn test_load_pdf_file_not_found() {
    let backend = setup();
    let result = backend.open("nonexistent.pdf");
    assert!(result.is_err());
}

#[test]
fn test_get_page_info() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    let page_info = document.page_info(0).expect("Failed to get page info");

    assert_eq!(page_info.page_index, 0);
    assert!(page_info.width > 0.0);
    assert!(page_info.height > 0.0);
}

#[test]
fn test_get_page_info_invalid_index() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    let result = document.page_info(9999);
    assert!(result.is_err());
}

#[test]
fn test_render_page() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    let png_bytes = document.render_page(0, 1.0).expect("Failed to render");

    assert!(png_bytes.len() > 100);
}

#[test]
fn test_render_page_with_scale() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");

    let bytes_1x = document.render_page(0, 1.0).unwrap();
    let bytes_2x = document.render_page(0, 2.0).unwrap();

    assert!(bytes_2x.len() > bytes_1x.len());
}

#[test]
fn test_profiling_store_completed_trace() {
    let profiling_store = ProfilingStore::default();

    profiling_store.start_trace(ProfilingData {
        name: "render_page".to_string(),
        details: Some(json!({ "page": 1, "scale": 1.0 })),
    });
    profiling_store.end_trace(ProfilingData {
        name: "render_page".to_string(),
        details: Some(json!({ "ok": true, "imageBytesLength": 128 })),
    });

    let snapshot = serde_json::to_value(profiling_store.snapshot()).unwrap();
    let events = snapshot["events"].as_array().unwrap();
    let event = &events[0];

    assert_eq!(events.len(), 1);
    assert_eq!(event["name"], Value::String("render_page".to_string()));
    assert!(event["durationMs"].is_u64());
    assert_eq!(event["details"]["start"]["page"], Value::from(1));
    assert_eq!(
        event["details"]["end"]["imageBytesLength"],
        Value::from(128)
    );
    assert!(event["startMemory"].is_object() || event["startMemory"].is_null());
    assert!(event["endMemory"].is_object() || event["endMemory"].is_null());
}

#[test]
fn test_profiling_store_reset() {
    let profiling_store = ProfilingStore::default();

    profiling_store.start_trace(ProfilingData {
        name: "render_page".to_string(),
        details: None,
    });
    profiling_store.end_trace(ProfilingData {
        name: "render_page".to_string(),
        details: None,
    });

    let initial_snapshot = serde_json::to_value(profiling_store.snapshot()).unwrap();
    let initial_session_id = initial_snapshot["sessionId"].as_u64().unwrap();
    assert_eq!(initial_snapshot["events"].as_array().unwrap().len(), 1);

    profiling_store.reset();

    let reset_snapshot = serde_json::to_value(profiling_store.snapshot()).unwrap();
    assert_eq!(reset_snapshot["events"].as_array().unwrap().len(), 0);
    assert_eq!(
        reset_snapshot["sessionId"].as_u64().unwrap(),
        initial_session_id + 1,
    );
}

#[test]
fn test_profiling_not_enabled() {
    let _env_lock = lock_env();
    let _env_var_guard = EnvVarGuard::without_vite_profile();

    let profiling_store = ProfilingStore::default();
    let _ = start_internal_trace(
        &profiling_store,
        ProfilingData {
            name: "render_page".to_string(),
            details: Some(json!({ "page": 1 })),
        },
    );
    let _ = end_internal_trace(
        &profiling_store,
        ProfilingData {
            name: "render_page".to_string(),
            details: Some(json!({ "ok": true })),
        },
    );

    let snapshot = serde_json::to_value(profiling_store.snapshot()).unwrap();
    assert_eq!(snapshot["events"].as_array().unwrap().len(), 0);
    assert_eq!(
        ensure_profiling_enabled().unwrap_err(),
        "Profiling is not enabled".to_string(),
    );
}

#[test]
fn test_profiling_commands_not_enabled() {
    let _env_lock = lock_env();
    let _env_var_guard = EnvVarGuard::without_vite_profile();

    let app = create_profiling_app(mock_builder());
    let profiling_store = app.state::<ProfilingStore>();

    let start_trace_result = profiling_start_trace(
        profiling_store.clone(),
        ProfilingData {
            name: "render_page".to_string(),
            details: None,
        },
    );
    let end_trace_result = profiling_end_trace(
        profiling_store.clone(),
        ProfilingData {
            name: "render_page".to_string(),
            details: None,
        },
    );
    let reset_result = profiling_reset(profiling_store.clone());
    let snapshot_result = profiling_get_snapshot(profiling_store);

    assert_eq!(
        start_trace_result.unwrap_err(),
        "Profiling is not enabled".to_string(),
    );
    assert_eq!(
        end_trace_result.unwrap_err(),
        "Profiling is not enabled".to_string(),
    );
    assert_eq!(
        reset_result.unwrap_err(),
        "Profiling is not enabled".to_string(),
    );
    match snapshot_result {
        Ok(_) => panic!("profiling_get_snapshot should fail when profiling is disabled"),
        Err(error) => assert_eq!(error, "Profiling is not enabled".to_string()),
    }
}
