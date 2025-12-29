#ifndef PDFBRIDGE_H
#define PDFBRIDGE_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// Opaque handle to a PDF document
typedef void* PDFDocumentHandle;

// Error codes
typedef enum {
    PDF_SUCCESS = 0,
    PDF_ERROR_INVALID_PATH = 1,
    PDF_ERROR_LOAD_FAILED = 2,
    PDF_ERROR_PAGE_NOT_FOUND = 3,
    PDF_ERROR_RENDER_FAILED = 4,
    PDF_ERROR_NULL_HANDLE = 5,
} PDFErrorCode;

// Result structure for operations that return data
typedef struct {
    PDFErrorCode error;
    char* error_message;  // NULL if no error, caller must free
} PDFResult;

// Document metadata
typedef struct {
    uint16_t page_count;
    char* title;      // NULL if not available, caller must free
    char* author;     // NULL if not available, caller must free
    char* subject;    // NULL if not available, caller must free
    char* creator;    // NULL if not available, caller must free
    char* producer;   // NULL if not available, caller must free
} PDFMetadata;

// Page info
typedef struct {
    uint16_t page_index;
    float width;
    float height;
} PDFPageInfo;

// Rendered image data
typedef struct {
    uint8_t* data;    // PNG bytes, caller must free with pdf_free_image
    uint32_t length;
    PDFErrorCode error;
    char* error_message;
} PDFImageResult;

// ============================================================================
// API Functions
// ============================================================================

/// Open a PDF document from a file path
/// Returns a handle that must be closed with pdf_close()
PDFDocumentHandle pdf_open(const char* path, PDFResult* result);

/// Close a PDF document and free resources
void pdf_close(PDFDocumentHandle handle);

/// Get document metadata
/// Caller must free the strings in the returned struct
PDFMetadata pdf_get_metadata(PDFDocumentHandle handle);

/// Get page count
uint16_t pdf_page_count(PDFDocumentHandle handle);

/// Get page info (dimensions)
PDFPageInfo pdf_get_page_info(PDFDocumentHandle handle, uint16_t page_index, PDFResult* result);

/// Render a page to PNG bytes
/// Caller must free the returned data with pdf_free_image()
PDFImageResult pdf_render_page(PDFDocumentHandle handle, uint16_t page_index, float scale);

/// Free image data returned by pdf_render_page
void pdf_free_image(uint8_t* data);

/// Free a string returned by the API
void pdf_free_string(char* str);

#ifdef __cplusplus
}
#endif

#endif // PDFBRIDGE_H

