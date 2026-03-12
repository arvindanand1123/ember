//! Tauri command endpoints for PDF operations.

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
