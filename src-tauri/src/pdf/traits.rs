use crate::pdf::error::PdfError;
use crate::pdf::types::{PageInfo, PdfMetadata};

/// Trait for PDF backend implementations (PDFKit, PDFium, etc.)
pub trait PdfBackend {
    /// Open a PDF document from a file path
    fn open(&self, path: &str) -> Result<Box<dyn PdfDocumentTrait>, PdfError>;
}

/// Trait for an opened PDF document
/// 
/// Named `PdfDocumentTrait` to avoid collision with pdfium-render's `PdfDocument`
pub trait PdfDocumentTrait {
    /// Get document metadata (page count, title, author, etc.)
    fn metadata(&self) -> &PdfMetadata;

    /// Get information about a specific page
    fn page_info(&self, page_index: u16) -> Result<PageInfo, PdfError>;

    /// Render a page to PNG bytes
    fn render_page(&self, page_index: u16, scale: f32) -> Result<Vec<u8>, PdfError>;
}
