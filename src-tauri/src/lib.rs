use base64::Engine;
use tauri::AppHandle;

// PDF module with pluggable backends
mod pdf;

use pdf::{Backend, PageInfo, PdfMetadata};

#[tauri::command]
fn load_pdf(
    app_handle: AppHandle,
    file_path: String,
    backend: Option<String>,
) -> Result<PdfMetadata, String> {
    let backend_type = parse_backend(backend);
    println!("Loading PDF file: {} (backend: {:?})", file_path, backend_type);

    let backend = pdf::get_backend(&app_handle, backend_type)?;
    let document = backend.open(&file_path)?;
    let metadata = document.metadata().clone();

    println!("PDF loaded successfully. Pages: {}", metadata.page_count);
    Ok(metadata)
}

#[tauri::command]
fn get_page_info(
    app_handle: AppHandle,
    file_path: String,
    page_index: u16,
    backend: Option<String>,
) -> Result<PageInfo, String> {
    let backend_type = parse_backend(backend);
    let backend = pdf::get_backend(&app_handle, backend_type)?;
    let document = backend.open(&file_path)?;
    document.page_info(page_index).map_err(|e| e.to_string())
}

#[tauri::command]
fn render_page_to_base64(
    app_handle: AppHandle,
    file_path: String,
    page_index: u16,
    scale: Option<f32>,
    backend: Option<String>,
) -> Result<String, String> {
    let backend_type = parse_backend(backend);
    let backend = pdf::get_backend(&app_handle, backend_type)?;
    let document = backend.open(&file_path)?;

    let scale_factor = scale.unwrap_or(1.0);
    let png_bytes = document
        .render_page(page_index, scale_factor)
        .map_err(|e| e.to_string())?;

    let base64_string = base64::engine::general_purpose::STANDARD.encode(&png_bytes);
    Ok(format!("data:image/png;base64,{}", base64_string))
}

/// Parse backend string to Backend enum, defaulting to Pdfium
fn parse_backend(backend: Option<String>) -> Backend {
    backend
        .and_then(|s| s.parse().ok())
        .unwrap_or(Backend::Pdfium)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            load_pdf,
            get_page_info,
            render_page_to_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
