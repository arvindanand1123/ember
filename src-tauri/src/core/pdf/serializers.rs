use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfMetadata {
    pub page_count: u16,
    pub title: Option<String>,
    pub author: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageInfo {
    pub page_index: u16,
    pub width: f32,
    pub height: f32,
}

#[derive(Debug)]
pub enum PdfError {
    Load(String),
    Page(String),
    Render(String),
    Backend(String),
}

impl fmt::Display for PdfError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PdfError::Load(msg) => write!(f, "Failed to load PDF: {}", msg),
            PdfError::Page(msg) => write!(f, "Page error: {}", msg),
            PdfError::Render(msg) => write!(f, "Render error: {}", msg),
            PdfError::Backend(msg) => write!(f, "Backend error: {}", msg),
        }
    }
}

impl std::error::Error for PdfError {}

impl From<PdfError> for String {
    fn from(err: PdfError) -> Self {
        err.to_string()
    }
}
