pub mod core;

mod file_api {
    use crate::core::files;

    #[tauri::command]
    pub fn save_pdf(source_path: String, target_path: String) -> Result<String, String> {
        files::save_pdf(&source_path, &target_path).map_err(|e| e.to_string())
    }
}

mod pdf_api {
    use crate::core::pdf::{self, PageInfo, PdfMetadata};

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
        file_path: String,
        page_index: u16,
        scale: Option<f32>,
    ) -> Result<Vec<u8>, String> {
        let backend = pdf::get_backend().map_err(|e| e.to_string())?;
        let document = backend.open(&file_path)?;

        let scale_factor = scale.unwrap_or(1.0);
        document
            .render_page(page_index, scale_factor)
            .map_err(|e| e.to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            file_api::save_pdf,
            pdf_api::load_pdf,
            pdf_api::get_page_info,
            pdf_api::render_page,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
