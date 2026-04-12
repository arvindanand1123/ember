pub mod core;
pub mod profiling;

mod pdf_api {
    use crate::core::pdf::{self, PageInfo, PdfMetadata};
    use crate::profiling::{self, ProfilingData, ProfilingStore};
    use serde_json::json;
    use tauri::State;

    #[tauri::command]
    pub fn load_pdf(file_path: String) -> Result<PdfMetadata, String> {
        println!("Loading PDF file: {}", file_path);

        let backend = pdf::get_backend().map_err(|e| e.to_string())?;
        let document = backend.open(&file_path)?;
        let metadata = document.metadata().clone();

        println!("PDF loaded successfully. Pages: {}", metadata.page_count);
        Ok(metadata)
    }

    #[tauri::command]
    pub fn get_page_info(file_path: String, page_index: u16) -> Result<PageInfo, String> {
        let backend = pdf::get_backend().map_err(|e| e.to_string())?;
        let document = backend.open(&file_path)?;
        document.page_info(page_index).map_err(|e| e.to_string())
    }

    #[tauri::command]
    pub fn render_page(
        profiling_store: State<'_, ProfilingStore>,
        file_path: String,
        page_index: u16,
        scale: Option<f32>,
    ) -> Result<Vec<u8>, String> {
        let scale_factor = scale.unwrap_or(1.0);
        let trace_name = profiling::next_trace_name("rust:render_page");

        let _ = profiling::start_internal_trace(
            &profiling_store,
            ProfilingData {
                name: trace_name.clone(),
                details: Some(json!({
                    "filePath": file_path.clone(),
                    "pageIndex": page_index,
                    "scale": scale_factor,
                })),
            },
        );

        let result = (|| {
            let _ = profiling::start_internal_trace(
                &profiling_store,
                ProfilingData {
                    name: "Opening document".to_string(),
                    details: Some(json!({
                        "filePath": file_path.clone(),
                        "pageIndex": page_index,
                        "scale": scale_factor,
                    })),
                },
            );
            let backend = pdf::get_backend().map_err(|e| e.to_string())?;
            let document = backend.open(&file_path)?;

            let _ = profiling::end_internal_trace(
                &profiling_store,
                ProfilingData {
                    name: "Opening document".to_string(),
                    details: Some(json!("Opening document")),
                },
            );

            document
                .render_page(page_index, scale_factor)
                .map_err(|e| e.to_string())
        })();

        let _ = profiling::end_internal_trace(
            &profiling_store,
            ProfilingData {
                name: trace_name,
                details: Some(match &result {
                    Ok(image_bytes) => json!({
                        "ok": true,
                        "imageBytesLength": image_bytes.len(),
                    }),
                    Err(error) => json!({
                        "ok": false,
                        "error": error,
                    }),
                }),
            },
        );

        result
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(profiling::ProfilingStore::default())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            profiling::ensure_profiler_window(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            pdf_api::load_pdf,
            pdf_api::get_page_info,
            pdf_api::render_page,
            profiling::profiling_start_trace,
            profiling::profiling_end_trace,
            profiling::profiling_reset,
            profiling::profiling_get_snapshot,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
