pub mod pdfium;
pub mod pdfkit;
pub mod serializers;
pub mod traits;

pub use serializers::{PageInfo, PdfError, PdfMetadata};
pub use traits::PdfBackend;

pub fn get_backend() -> Result<Box<dyn PdfBackend>, PdfError> {
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
