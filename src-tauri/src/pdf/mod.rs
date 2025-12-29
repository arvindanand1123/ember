//! PDF handling module with pluggable backends
//!
//! This module provides a unified interface for PDF operations,
//! with support for multiple backends:
//! - PDFium (cross-platform, default)
//! - PDFKit (macOS native, via Swift bridge)

pub mod error;
pub mod pdfium;
pub mod pdfkit;
pub mod traits;
pub mod types;

// Re-export commonly used types
pub use error::PdfError;
pub use traits::PdfBackend;
pub use types::{Backend, PageInfo, PdfMetadata};

use tauri::{AppHandle, Runtime};

/// Get a PDF backend by type
pub fn get_backend<R: Runtime>(
    app_handle: &AppHandle<R>,
    backend: Backend,
) -> Result<Box<dyn PdfBackend>, PdfError> {
    match backend {
        Backend::Pdfium => {
            let backend = pdfium::PdfiumBackend::new(app_handle)?;
            Ok(Box::new(backend))
        }
        Backend::Pdfkit => {
            // PDFKit is only available on macOS
            #[cfg(target_os = "macos")]
            {
                let backend = pdfkit::PdfKitBackend::new()?;
                Ok(Box::new(backend))
            }
            #[cfg(not(target_os = "macos"))]
            {
                Err(PdfError::BackendError(
                    "PDFKit is only available on macOS".to_string(),
                ))
            }
        }
    }
}
