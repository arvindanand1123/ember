use std::fmt;

#[derive(Debug)]
pub enum PdfError {
    /// Failed to load the PDF file
    LoadError(String),
    /// Failed to access a page (e.g., page index out of bounds)
    PageError(String),
    /// Failed to render a page
    RenderError(String),
    /// Backend-specific error
    BackendError(String),
}

impl fmt::Display for PdfError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PdfError::LoadError(msg) => write!(f, "Failed to load PDF: {}", msg),
            PdfError::PageError(msg) => write!(f, "Page error: {}", msg),
            PdfError::RenderError(msg) => write!(f, "Render error: {}", msg),
            PdfError::BackendError(msg) => write!(f, "Backend error: {}", msg),
        }
    }
}

impl std::error::Error for PdfError {}

// Convert to String for Tauri command results
impl From<PdfError> for String {
    fn from(err: PdfError) -> Self {
        err.to_string()
    }
}
