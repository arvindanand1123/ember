use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfMetadata {
    pub page_count: u16,
    pub title: Option<String>,
    pub author: Option<String>,
    pub subject: Option<String>,
    pub creator: Option<String>,
    pub producer: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageInfo {
    pub page_index: u16,
    pub width: f32,
    pub height: f32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "lowercase")]
pub enum Backend {
    #[default]
    Pdfium,
    Pdfkit,
}

impl std::str::FromStr for Backend {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "pdfium" => Ok(Backend::Pdfium),
            "pdfkit" => Ok(Backend::Pdfkit),
            _ => Err(format!("Unknown backend: {}", s)),
        }
    }
}
