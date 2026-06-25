use ember_lib::{file_api, pdf_api};
use std::fs;

mod common;
use common::TempDir;

const TEST_PDF: &str = "../tests/basic.pdf";

#[test]
fn test_load_pdf_metadata() {
    let metadata = pdf_api::load_pdf(TEST_PDF.to_string()).expect("Failed to load PDF");
    assert!(metadata.page_count > 0);
}

#[test]
fn test_load_pdf_file_not_found() {
    let result = pdf_api::load_pdf("nonexistent.pdf".to_string());
    assert!(result.is_err());
}

#[test]
fn test_get_page_info() {
    let page_info = pdf_api::get_page_info(TEST_PDF.to_string(), 0).expect("Failed");

    assert_eq!(page_info.page_index, 0);
    assert!(page_info.width > 0.0);
    assert!(page_info.height > 0.0);
}

#[test]
fn test_get_page_info_invalid_index() {
    let result = pdf_api::get_page_info(TEST_PDF.to_string(), 9999);
    assert!(result.is_err());
}

#[test]
fn test_render_page() {
    let png_bytes = pdf_api::render_page(TEST_PDF.to_string(), 0, None).expect("Failed");

    assert!(png_bytes.len() > 100);
}

#[test]
fn test_render_page_with_scale() {
    let bytes_1x = pdf_api::render_page(TEST_PDF.to_string(), 0, Some(1.0)).unwrap();
    let bytes_2x = pdf_api::render_page(TEST_PDF.to_string(), 0, Some(2.0)).unwrap();

    assert!(bytes_2x.len() > bytes_1x.len());
}

#[test]
fn test_save_as_pdf() {
    // Keep `temp` bound for the whole test; dropping it early would clean up before
    // save_pdf runs, leaving the dir it creates dangling.
    let temp = TempDir::new("save-as");
    let target_path = temp.join("nested/output");

    let saved_path = file_api::save_pdf(
        TEST_PDF.to_string(),
        target_path.to_string_lossy().into_owned(),
    )
    .expect("Failed");

    let expected = target_path.with_extension("pdf");
    assert_eq!(saved_path, expected.to_string_lossy());

    let source_bytes = fs::read(TEST_PDF).expect("source pdf should exist");
    let dest_bytes = fs::read(&saved_path).expect("saved pdf should exist");
    assert_eq!(dest_bytes, source_bytes);
}

#[test]
fn test_save_pdf_same_path() {
    let saved_path =
        file_api::save_pdf(TEST_PDF.to_string(), TEST_PDF.to_string()).expect("Failed");
    assert_eq!(saved_path, TEST_PDF);
}
