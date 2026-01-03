pub mod error;
pub mod pdfium;
pub mod pdfkit;
pub mod traits;
pub mod types;

pub use error::PdfError;
pub use traits::PdfBackend;
pub use types::{Backend, PageInfo, PdfMetadata};

use tauri::{AppHandle, Runtime};

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
