use std::ffi::{c_char, c_float, CStr, CString};

use crate::core::pdf::serializers::{PageInfo, PdfError, PdfMetadata};
use crate::core::pdf::traits::{PdfBackend, PdfDocumentTrait};

// FFI error codes
const PDF_SUCCESS: i32 = 0;
const PDF_ERROR_INVALID_PATH: i32 = 1;
const PDF_ERROR_LOAD_FAILED: i32 = 2;
const PDF_ERROR_PAGE_NOT_FOUND: i32 = 3;
const PDF_ERROR_RENDER_FAILED: i32 = 4;
const PDF_ERROR_NULL_HANDLE: i32 = 5;

// FFI declarations
#[link(name = "PDFBridge", kind = "static")]
extern "C" {
    fn pdf_open(path: *const c_char, error_out: *mut i32) -> u64;
    fn pdf_close(handle: u64);
    fn pdf_page_count(handle: u64) -> u16;
    fn pdf_get_title(handle: u64) -> *mut c_char;
    fn pdf_get_author(handle: u64) -> *mut c_char;
    fn pdf_get_page_width(handle: u64, page_index: u16) -> c_float;
    fn pdf_get_page_height(handle: u64, page_index: u16) -> c_float;
    fn pdf_render_page(
        handle: u64,
        page_index: u16,
        scale: c_float,
        length_out: *mut u32,
        error_out: *mut i32,
    ) -> *mut u8;
    fn pdf_free_image(data: *mut u8);
    fn pdf_free_string(str: *mut c_char);
}

// Backend

pub struct PdfKitBackend;

impl PdfKitBackend {
    pub fn new() -> Result<Self, PdfError> {
        Ok(Self)
    }
}

impl PdfBackend for PdfKitBackend {
    fn open(&self, path: &str) -> Result<Box<dyn PdfDocumentTrait>, PdfError> {
        let c_path =
            CString::new(path).map_err(|e| PdfError::LoadError(format!("Invalid path: {}", e)))?;
        let mut error: i32 = 0;

        let handle = unsafe { pdf_open(c_path.as_ptr(), &mut error) };

        if handle == 0 || error != PDF_SUCCESS {
            return Err(PdfError::LoadError(match error {
                PDF_ERROR_INVALID_PATH => "Invalid path".to_string(),
                PDF_ERROR_LOAD_FAILED => format!("Failed to load PDF: {}", path),
                _ => format!("Unknown error: {}", error),
            }));
        }

        let page_count = unsafe { pdf_page_count(handle) };
        let title = unsafe { get_optional_string(pdf_get_title(handle)) };
        let author = unsafe { get_optional_string(pdf_get_author(handle)) };

        let metadata = PdfMetadata {
            page_count,
            title,
            author,
        };

        Ok(Box::new(PdfKitDocument { handle, metadata }))
    }
}

// Document

pub struct PdfKitDocument {
    handle: u64,
    metadata: PdfMetadata,
}

impl Drop for PdfKitDocument {
    fn drop(&mut self) {
        unsafe { pdf_close(self.handle) };
    }
}

impl PdfDocumentTrait for PdfKitDocument {
    fn metadata(&self) -> &PdfMetadata {
        &self.metadata
    }

    fn page_info(&self, page_index: u16) -> Result<PageInfo, PdfError> {
        let width = unsafe { pdf_get_page_width(self.handle, page_index) };
        let height = unsafe { pdf_get_page_height(self.handle, page_index) };

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
        let mut length: u32 = 0;
        let mut error: i32 = 0;

        let data_ptr =
            unsafe { pdf_render_page(self.handle, page_index, scale, &mut length, &mut error) };

        if data_ptr.is_null() || error != PDF_SUCCESS {
            return Err(PdfError::RenderError(match error {
                PDF_ERROR_NULL_HANDLE => "Invalid document handle".to_string(),
                PDF_ERROR_PAGE_NOT_FOUND => format!("Page {} not found", page_index),
                PDF_ERROR_RENDER_FAILED => "Render failed".to_string(),
                _ => format!("Unknown error: {}", error),
            }));
        }

        let data = unsafe { std::slice::from_raw_parts(data_ptr, length as usize).to_vec() };
        unsafe { pdf_free_image(data_ptr) };

        Ok(data)
    }
}

// Helpers

unsafe fn get_optional_string(ptr: *mut c_char) -> Option<String> {
    if ptr.is_null() {
        return None;
    }
    let s = CStr::from_ptr(ptr).to_string_lossy().into_owned();
    pdf_free_string(ptr);
    if s.is_empty() { None } else { Some(s) }
}
