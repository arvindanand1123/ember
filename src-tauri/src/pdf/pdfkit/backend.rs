use crate::pdf::error::PdfError;
use crate::pdf::traits::{PdfBackend, PdfDocumentTrait};
use crate::pdf::types::{PageInfo, PdfMetadata};

use super::ffi::PdfHandle;

/// PDFKit-based PDF backend (macOS only)
pub struct PdfKitBackend;

impl PdfKitBackend {
    pub fn new() -> Result<Self, PdfError> {
        Ok(Self)
    }
}

impl PdfBackend for PdfKitBackend {
    fn open(&self, path: &str) -> Result<Box<dyn PdfDocumentTrait>, PdfError> {
        let handle = PdfHandle::open(path).map_err(PdfError::LoadError)?;

        let metadata = PdfMetadata {
            page_count: handle.page_count(),
            title: handle.title(),
            author: handle.author(),
            subject: None, // Not implemented in Swift yet
            creator: None, // Not implemented in Swift yet
            producer: None, // Not implemented in Swift yet
        };

        Ok(Box::new(PdfKitDocument { handle, metadata }))
    }
}

/// A PDF document opened with PDFKit
pub struct PdfKitDocument {
    handle: PdfHandle,
    metadata: PdfMetadata,
}

impl PdfDocumentTrait for PdfKitDocument {
    fn metadata(&self) -> &PdfMetadata {
        &self.metadata
    }

    fn page_info(&self, page_index: u16) -> Result<PageInfo, PdfError> {
        let width = self.handle.page_width(page_index);
        let height = self.handle.page_height(page_index);

        if width == 0.0 && height == 0.0 {
            return Err(PdfError::PageError(format!(
                "Page {} not found",
                page_index
            )));
        }

        Ok(PageInfo {
            page_index,
            width,
            height,
        })
    }

    fn render_page(&self, page_index: u16, scale: f32) -> Result<Vec<u8>, PdfError> {
        self.handle
            .render_page(page_index, scale)
            .map_err(PdfError::RenderError)
    }
}
