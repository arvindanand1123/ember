use base64::Engine;
use pdfium_render::prelude::*;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};

const PDFIUM_LIB_NAME: &str = "libpdfium.dylib";
const PDFIUM_DIR_NAME: &str = "libpdfium";

pub fn get_pdfium<R: Runtime>(app_handle: &AppHandle<R>) -> Result<Pdfium, String> {
    let path;
    if let Ok(resource_dir) = app_handle.path().resource_dir() {
        path = resource_dir.join(PDFIUM_DIR_NAME).join(PDFIUM_LIB_NAME);
    } else {
        path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join(PDFIUM_DIR_NAME)
            .join(PDFIUM_LIB_NAME);
    }

    if !path.exists() {
        match Pdfium::bind_to_system_library() {
            Ok(bindings) => Ok(Pdfium::new(bindings)),
            Err(e) => Err(format!("Failed to load Pdfium: {:?}", e)),
        }
    } else {
        match Pdfium::bind_to_library(path) {
            Ok(bindings) => Ok(Pdfium::new(bindings)),
            Err(e) => Err(format!("Failed to load Pdfium from path: {:?}", e)),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct PdfMetadata {
    pub page_count: u16,
    pub title: Option<String>,
    pub author: Option<String>,
    pub subject: Option<String>,
    pub creator: Option<String>,
    pub producer: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct PageInfo {
    pub page_index: u16,
    pub width: f32,
    pub height: f32,
}

pub fn load_pdf_metadata(pdfium: &Pdfium, file_path: &str) -> Result<PdfMetadata, String> {
    let document = pdfium
        .load_pdf_from_file(file_path, None)
        .map_err(|e| format!("Failed to load PDF: {:?}", e))?;

    let metadata = PdfMetadata {
        page_count: document.pages().len(),
        title: document
            .metadata()
            .get(PdfDocumentMetadataTagType::Title)
            .map(|t| t.value().to_string()),
        author: document
            .metadata()
            .get(PdfDocumentMetadataTagType::Author)
            .map(|t| t.value().to_string()),
        subject: document
            .metadata()
            .get(PdfDocumentMetadataTagType::Subject)
            .map(|t| t.value().to_string()),
        creator: document
            .metadata()
            .get(PdfDocumentMetadataTagType::Creator)
            .map(|t| t.value().to_string()),
        producer: document
            .metadata()
            .get(PdfDocumentMetadataTagType::Producer)
            .map(|t| t.value().to_string()),
    };

    Ok(metadata)
}

pub fn get_pdf_page_info(
    pdfium: &Pdfium,
    file_path: &str,
    page_index: u16,
) -> Result<PageInfo, String> {
    let document = pdfium
        .load_pdf_from_file(file_path, None)
        .map_err(|e| format!("Failed to load PDF: {:?}", e))?;

    let page = document
        .pages()
        .get(page_index)
        .map_err(|e| format!("Failed to get page {}: {:?}", page_index, e))?;

    let width = page.width().value;
    let height = page.height().value;

    Ok(PageInfo {
        page_index,
        width,
        height,
    })
}

pub fn render_pdf_page_to_base64(
    pdfium: &Pdfium,
    file_path: &str,
    page_index: u16,
    scale: Option<f32>,
) -> Result<String, String> {
    let document = pdfium
        .load_pdf_from_file(file_path, None)
        .map_err(|e| format!("Failed to load PDF: {:?}", e))?;

    let page = document
        .pages()
        .get(page_index)
        .map_err(|e| format!("Failed to get page {}: {:?}", page_index, e))?;

    let scale_factor = scale.unwrap_or(1.0);
    let render_config = PdfRenderConfig::new()
        .set_target_width((page.width().value * scale_factor) as i32)
        .set_maximum_height((page.height().value * scale_factor) as i32);

    let bitmap = page
        .render_with_config(&render_config)
        .map_err(|e| format!("Failed to render page: {:?}", e))?;

    let image = bitmap.as_image();
    let image_buffer = image
        .as_rgba8()
        .ok_or_else(|| "Failed to convert bitmap to RGBA8".to_string())?;

    let mut png_bytes = Vec::new();
    image_buffer
        .write_to(
            &mut std::io::Cursor::new(&mut png_bytes),
            image::ImageFormat::Png,
        )
        .map_err(|e| format!("Failed to encode PNG: {:?}", e))?;

    let base64_string = base64::engine::general_purpose::STANDARD.encode(&png_bytes);

    Ok(format!("data:image/png;base64,{}", base64_string))
}

#[tauri::command]
fn load_pdf(app_handle: AppHandle, file_path: String) -> Result<PdfMetadata, String> {
    println!("Loading PDF file: {}", file_path);
    let pdfium = get_pdfium(&app_handle)?;
    let metadata = load_pdf_metadata(&pdfium, &file_path)?;
    println!("PDF loaded successfully. Pages: {}", metadata.page_count);
    Ok(metadata)
}

#[tauri::command]
fn get_page_info(
    app_handle: AppHandle,
    file_path: String,
    page_index: u16,
) -> Result<PageInfo, String> {
    let pdfium = get_pdfium(&app_handle)?;
    get_pdf_page_info(&pdfium, &file_path, page_index)
}

#[tauri::command]
fn render_page_to_base64(
    app_handle: AppHandle,
    file_path: String,
    page_index: u16,
    scale: Option<f32>,
) -> Result<String, String> {
    let pdfium = get_pdfium(&app_handle)?;
    render_pdf_page_to_base64(&pdfium, &file_path, page_index, scale)
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
