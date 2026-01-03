//! Tauri command endpoints for PDF operations.

use base64::Engine;

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
pub fn render_page_to_base64(
    file_path: String,
    page_index: u16,
    scale: Option<f32>,
) -> Result<String, String> {
    let backend = pdf::get_backend().map_err(|e| e.to_string())?;
    let document = backend.open(&file_path)?;

    let scale_factor = scale.unwrap_or(1.0);
    let png_bytes = document
        .render_page(page_index, scale_factor)
        .map_err(|e| e.to_string())?;

    let base64_string = base64::engine::general_purpose::STANDARD.encode(&png_bytes);
    Ok(format!("data:image/png;base64,{}", base64_string))
}
