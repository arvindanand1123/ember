use pdfium_render::prelude::Pdfium;
use phorgepdf_lib::{get_pdf_page_info, get_pdfium, load_pdf_metadata, render_pdf_page_to_base64};

const TEST_PDF: &str = "../tests/basic.pdf";

fn setup() -> Pdfium {
    let app = tauri::test::mock_app();
    get_pdfium(app.handle()).expect("Failed to load pdfium")
}

#[test]
fn test_load_pdf_metadata() {
    let pdfium = setup();
    let metadata = load_pdf_metadata(&pdfium, TEST_PDF).expect("Failed to load PDF");
    assert!(metadata.page_count > 0);
}

#[test]
fn test_load_pdf_file_not_found() {
    let pdfium = setup();
    let result = load_pdf_metadata(&pdfium, "nonexistent.pdf");
    assert!(result.is_err());
}

#[test]
fn test_get_page_info() {
    let pdfium = setup();
    let page_info = get_pdf_page_info(&pdfium, TEST_PDF, 0).expect("Failed to get page info");

    assert_eq!(page_info.page_index, 0);
    assert!(page_info.width > 0.0);
    assert!(page_info.height > 0.0);
}

#[test]
fn test_get_page_info_invalid_index() {
    let pdfium = setup();
    let result = get_pdf_page_info(&pdfium, TEST_PDF, 9999);
    assert!(result.is_err());
}

#[test]
fn test_render_page_to_base64() {
    let pdfium = setup();
    let base64 = render_pdf_page_to_base64(&pdfium, TEST_PDF, 0, None).expect("Failed to render");

    assert!(base64.starts_with("data:image/png;base64,"));
    assert!(base64.len() > 100);
}

#[test]
fn test_render_page_with_scale() {
    let pdfium = setup();

    let base64_1x = render_pdf_page_to_base64(&pdfium, TEST_PDF, 0, Some(1.0)).unwrap();
    let base64_2x = render_pdf_page_to_base64(&pdfium, TEST_PDF, 0, Some(2.0)).unwrap();

    assert!(base64_2x.len() > base64_1x.len());
}
