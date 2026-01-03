use crate::pdf::error::PdfError;
use crate::pdf::types::{PageInfo, PdfMetadata};

pub trait PdfBackend {
    fn open(&self, path: &str) -> Result<Box<dyn PdfDocumentTrait>, PdfError>;
}

pub trait PdfDocumentTrait {
    fn metadata(&self) -> &PdfMetadata;
    fn page_info(&self, page_index: u16) -> Result<PageInfo, PdfError>;
    fn render_page(&self, page_index: u16, scale: f32) -> Result<Vec<u8>, PdfError>;
}
