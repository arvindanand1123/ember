use ember_lib::core::files;
use ember_lib::core::pdf::{get_backend, PdfBackend, PdfDocumentTrait};
use std::env;
use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

const TEST_PDF: &str = "../tests/basic.pdf";

struct TestContext {
    backend: Box<dyn PdfBackend>,
    temp_dirs: Vec<PathBuf>,
}

impl TestContext {
    fn setup() -> Self {
        Self {
            backend: get_backend().expect("Failed to create backend"),
            temp_dirs: Vec::new(),
        }
    }

    fn open_test_pdf(&self) -> Box<dyn PdfDocumentTrait> {
        self.backend.open(TEST_PDF).expect("Failed to load PDF")
    }

    fn create_temp_dir(&mut self, name: &str) -> PathBuf {
        let path = unique_temp_path(name);
        self.temp_dirs.push(path.clone());
        path
    }
}

impl Drop for TestContext {
    fn drop(&mut self) {
        for path in &self.temp_dirs {
            if path.exists() {
                let _ = fs::remove_dir_all(path);
            }
        }
    }
}

#[test]
fn test_load_pdf_metadata() {
    let context = TestContext::setup();
    let document = context.open_test_pdf();
    assert!(document.metadata().page_count > 0);
}

#[test]
fn test_load_pdf_file_not_found() {
    let context = TestContext::setup();
    let result = context.backend.open("nonexistent.pdf");
    assert!(result.is_err());
}

#[test]
fn test_get_page_info() {
    let context = TestContext::setup();
    let document = context.open_test_pdf();
    let page_info = document.page_info(0).expect("Failed to get page info");

    assert_eq!(page_info.page_index, 0);
    assert!(page_info.width > 0.0);
    assert!(page_info.height > 0.0);
}

#[test]
fn test_get_page_info_invalid_index() {
    let context = TestContext::setup();
    let document = context.open_test_pdf();
    let result = document.page_info(9999);
    assert!(result.is_err());
}

#[test]
fn test_render_page() {
    let context = TestContext::setup();
    let document = context.open_test_pdf();
    let png_bytes = document.render_page(0, 1.0).expect("Failed to render");

    assert!(png_bytes.len() > 100);
}

#[test]
fn test_render_page_with_scale() {
    let context = TestContext::setup();
    let document = context.open_test_pdf();

    let bytes_1x = document.render_page(0, 1.0).unwrap();
    let bytes_2x = document.render_page(0, 2.0).unwrap();

    assert!(bytes_2x.len() > bytes_1x.len());
}

fn unique_temp_path(name: &str) -> PathBuf {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("time should move forward")
        .as_nanos();

    env::temp_dir().join(format!("ember-{name}-{timestamp}-{}", std::process::id()))
}

#[test]
fn test_save_as_pdf() {
    let mut context = TestContext::setup();
    let base_dir = context.create_temp_dir("save-pdf-copy");
    let target_path = base_dir.join("exports").join("saved-copy");

    let saved_path =
        files::save_pdf(TEST_PDF, &target_path.to_string_lossy()).expect("Failed to save pdf copy");

    let saved_path = PathBuf::from(saved_path);
    assert_eq!(
        saved_path.extension().and_then(|ext| ext.to_str()),
        Some("pdf")
    );
    assert!(saved_path.exists());

    let source_bytes = fs::read(TEST_PDF).expect("source pdf should exist");
    let saved_bytes = fs::read(&saved_path).expect("saved pdf should exist");
    assert_eq!(saved_bytes, source_bytes);
}

#[test]
fn test_save_pdf_same_path_is_a_noop() {
    let _context = TestContext::setup();
    let saved_path = files::save_pdf(TEST_PDF, TEST_PDF).expect("same-path save should succeed");
    assert_eq!(saved_path, TEST_PDF);
}
