use std::ffi::{c_char, c_float, CStr, CString};

pub const PDF_SUCCESS: i32 = 0;
pub const PDF_ERROR_INVALID_PATH: i32 = 1;
pub const PDF_ERROR_LOAD_FAILED: i32 = 2;
pub const PDF_ERROR_PAGE_NOT_FOUND: i32 = 3;
pub const PDF_ERROR_RENDER_FAILED: i32 = 4;
pub const PDF_ERROR_NULL_HANDLE: i32 = 5;

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

pub struct PdfHandle(u64);

impl PdfHandle {
    pub fn open(path: &str) -> Result<Self, String> {
        let c_path = CString::new(path).map_err(|e| format!("Invalid path: {}", e))?;
        let mut error: i32 = 0;

        let handle = unsafe { pdf_open(c_path.as_ptr(), &mut error) };

        if handle == 0 || error != PDF_SUCCESS {
            return Err(match error {
                PDF_ERROR_INVALID_PATH => "Invalid path".to_string(),
                PDF_ERROR_LOAD_FAILED => format!("Failed to load PDF: {}", path),
                _ => format!("Unknown error: {}", error),
            });
        }

        Ok(Self(handle))
    }

    pub fn page_count(&self) -> u16 {
        unsafe { pdf_page_count(self.0) }
    }

    pub fn title(&self) -> Option<String> {
        unsafe {
            let ptr = pdf_get_title(self.0);
            if ptr.is_null() {
                return None;
            }
            let s = CStr::from_ptr(ptr).to_string_lossy().into_owned();
            pdf_free_string(ptr);
            if s.is_empty() {
                None
            } else {
                Some(s)
            }
        }
    }

    pub fn author(&self) -> Option<String> {
        unsafe {
            let ptr = pdf_get_author(self.0);
            if ptr.is_null() {
                return None;
            }
            let s = CStr::from_ptr(ptr).to_string_lossy().into_owned();
            pdf_free_string(ptr);
            if s.is_empty() {
                None
            } else {
                Some(s)
            }
        }
    }

    pub fn page_width(&self, page_index: u16) -> f32 {
        unsafe { pdf_get_page_width(self.0, page_index) }
    }

    pub fn page_height(&self, page_index: u16) -> f32 {
        unsafe { pdf_get_page_height(self.0, page_index) }
    }

    pub fn render_page(&self, page_index: u16, scale: f32) -> Result<Vec<u8>, String> {
        let mut length: u32 = 0;
        let mut error: i32 = 0;

        let data_ptr =
            unsafe { pdf_render_page(self.0, page_index, scale, &mut length, &mut error) };

        if data_ptr.is_null() || error != PDF_SUCCESS {
            return Err(match error {
                PDF_ERROR_NULL_HANDLE => "Invalid document handle".to_string(),
                PDF_ERROR_PAGE_NOT_FOUND => format!("Page {} not found", page_index),
                PDF_ERROR_RENDER_FAILED => "Render failed".to_string(),
                _ => format!("Unknown error: {}", error),
            });
        }

        let data = unsafe { std::slice::from_raw_parts(data_ptr, length as usize).to_vec() };

        unsafe { pdf_free_image(data_ptr) };

        Ok(data)
    }
}

impl Drop for PdfHandle {
    fn drop(&mut self) {
        unsafe { pdf_close(self.0) };
    }
}

