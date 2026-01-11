use phorgepdf_lib::core::pdf::{get_backend, PdfBackend};

const TEST_PDF: &str = "../tests/basic.pdf";

fn setup() -> Box<dyn PdfBackend> {
    get_backend().expect("Failed to create backend")
}

#[test]
fn test_load_pdf_metadata() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    assert!(document.metadata().page_count > 0);
}

#[test]
fn test_load_pdf_file_not_found() {
    let backend = setup();
    let result = backend.open("nonexistent.pdf");
    assert!(result.is_err());
}

#[test]
fn test_get_page_info() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    let page_info = document.page_info(0).expect("Failed to get page info");

    assert_eq!(page_info.page_index, 0);
    assert!(page_info.width > 0.0);
    assert!(page_info.height > 0.0);
}

#[test]
fn test_get_page_info_invalid_index() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    let result = document.page_info(9999);
    assert!(result.is_err());
}

#[test]
fn test_render_page() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");
    let png_bytes = document.render_page(0, 1.0).expect("Failed to render");

    assert!(png_bytes.len() > 100);
}

#[test]
fn test_render_page_with_scale() {
    let backend = setup();
    let document = backend.open(TEST_PDF).expect("Failed to load PDF");

    let bytes_1x = document.render_page(0, 1.0).unwrap();
    let bytes_2x = document.render_page(0, 2.0).unwrap();

    assert!(bytes_2x.len() > bytes_1x.len());
}
