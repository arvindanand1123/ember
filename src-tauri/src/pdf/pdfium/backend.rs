use pdfium_render::prelude::*;
use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};

use crate::pdf::error::PdfError;
use crate::pdf::traits::{PdfBackend, PdfDocumentTrait};
use crate::pdf::types::{PageInfo, PdfMetadata};

const PDFIUM_LIB_NAME: &str = "libpdfium.dylib";
const PDFIUM_DIR_NAME: &str = "libpdfium";

/// PDFium-based PDF backend (cross-platform)
pub struct PdfiumBackend {
    lib_path: Option<PathBuf>,
}

impl PdfiumBackend {
    /// Create a new PdfiumBackend, determining the library path
    pub fn new<R: Runtime>(app_handle: &AppHandle<R>) -> Result<Self, PdfError> {
        let path = if let Ok(resource_dir) = app_handle.path().resource_dir() {
            let p = resource_dir.join(PDFIUM_DIR_NAME).join(PDFIUM_LIB_NAME);
            if p.exists() { Some(p) } else { None }
        } else {
            let p = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join(PDFIUM_DIR_NAME)
                .join(PDFIUM_LIB_NAME);
            if p.exists() { Some(p) } else { None }
        };

        Ok(Self { lib_path: path })
    }

    /// Load the Pdfium library
    fn load_pdfium(&self) -> Result<Pdfium, PdfError> {
        let bindings = if let Some(ref path) = self.lib_path {
            Pdfium::bind_to_library(path)
                .map_err(|e| PdfError::BackendError(format!("Failed to load Pdfium from {:?}: {:?}", path, e)))?
        } else {
            Pdfium::bind_to_system_library()
                .map_err(|e| PdfError::BackendError(format!("Failed to load system Pdfium: {:?}", e)))?
        };

        Ok(Pdfium::new(bindings))
    }
}

impl PdfBackend for PdfiumBackend {
    fn open(&self, path: &str) -> Result<Box<dyn PdfDocumentTrait>, PdfError> {
        let pdfium = self.load_pdfium()?;
        
        let document = pdfium
            .load_pdf_from_file(path, None)
            .map_err(|e| PdfError::LoadError(format!("{:?}", e)))?;

        let metadata = extract_metadata(&document);

        Ok(Box::new(PdfiumDocument {
            path: path.to_string(),
            lib_path: self.lib_path.clone(),
            metadata,
        }))
    }
}

/// A PDF document opened with PDFium
pub struct PdfiumDocument {
    path: String,
    lib_path: Option<PathBuf>,
    metadata: PdfMetadata,
}

impl PdfiumDocument {
    /// Load Pdfium library
    fn load_pdfium(&self) -> Result<Pdfium, PdfError> {
        let bindings = if let Some(ref path) = self.lib_path {
            Pdfium::bind_to_library(path)
                .map_err(|e| PdfError::BackendError(format!("Failed to load Pdfium: {:?}", e)))?
        } else {
            Pdfium::bind_to_system_library()
                .map_err(|e| PdfError::BackendError(format!("Failed to load Pdfium: {:?}", e)))?
        };

        Ok(Pdfium::new(bindings))
    }

    /// Helper to open the document and perform an operation
    fn with_document<F, T>(&self, f: F) -> Result<T, PdfError>
    where
        F: FnOnce(&pdfium_render::prelude::PdfDocument<'_>) -> Result<T, PdfError>,
    {
        let pdfium = self.load_pdfium()?;
        let document = pdfium
            .load_pdf_from_file(&self.path, None)
            .map_err(|e| PdfError::LoadError(format!("{:?}", e)))?;

        f(&document)
    }
}

impl PdfDocumentTrait for PdfiumDocument {
    fn metadata(&self) -> &PdfMetadata {
        &self.metadata
    }

    fn page_info(&self, page_index: u16) -> Result<PageInfo, PdfError> {
        self.with_document(|document| {
            let page = document
                .pages()
                .get(page_index)
                .map_err(|e| PdfError::PageError(format!("Failed to get page {}: {:?}", page_index, e)))?;

            Ok(PageInfo {
                page_index,
                width: page.width().value,
                height: page.height().value,
            })
        })
    }

    fn render_page(&self, page_index: u16, scale: f32) -> Result<Vec<u8>, PdfError> {
        self.with_document(|document| {
            let page = document
                .pages()
                .get(page_index)
                .map_err(|e| PdfError::PageError(format!("Failed to get page {}: {:?}", page_index, e)))?;

            let render_config = PdfRenderConfig::new()
                .set_target_width((page.width().value * scale) as i32)
                .set_maximum_height((page.height().value * scale) as i32);

            let bitmap = page
                .render_with_config(&render_config)
                .map_err(|e| PdfError::RenderError(format!("Failed to render page: {:?}", e)))?;

            let image = bitmap.as_image();
            let image_buffer = image
                .as_rgba8()
                .ok_or_else(|| PdfError::RenderError("Failed to convert bitmap to RGBA8".to_string()))?;

            let mut png_bytes = Vec::new();
            image_buffer
                .write_to(
                    &mut std::io::Cursor::new(&mut png_bytes),
                    image::ImageFormat::Png,
                )
                .map_err(|e| PdfError::RenderError(format!("Failed to encode PNG: {:?}", e)))?;

            Ok(png_bytes)
        })
    }
}

/// Extract metadata from a PDFium document
fn extract_metadata(document: &pdfium_render::prelude::PdfDocument<'_>) -> PdfMetadata {
    PdfMetadata {
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
    }
}
