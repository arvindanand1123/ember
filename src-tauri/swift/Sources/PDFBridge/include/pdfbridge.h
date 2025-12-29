#ifndef PDFBRIDGE_H
#define PDFBRIDGE_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// Error codes
#define PDF_SUCCESS 0
#define PDF_ERROR_INVALID_PATH 1
#define PDF_ERROR_LOAD_FAILED 2
#define PDF_ERROR_PAGE_NOT_FOUND 3
#define PDF_ERROR_RENDER_FAILED 4
#define PDF_ERROR_NULL_HANDLE 5

// ============================================================================
// API Functions
// ============================================================================

/// Open a PDF document from a file path
/// Returns handle (0 on error), error code written to error_out
uint64_t pdf_open(const char* path, int32_t* error_out);

/// Close a PDF document and free resources
void pdf_close(uint64_t handle);

/// Get page count (0 if invalid handle)
uint16_t pdf_page_count(uint64_t handle);

/// Get document title (caller must free with pdf_free_string, NULL if not available)
char* pdf_get_title(uint64_t handle);

/// Get document author (caller must free with pdf_free_string, NULL if not available)
char* pdf_get_author(uint64_t handle);

/// Get page width (0 if invalid)
float pdf_get_page_width(uint64_t handle, uint16_t page_index);

/// Get page height (0 if invalid)
float pdf_get_page_height(uint64_t handle, uint16_t page_index);

/// Render a page to PNG bytes
/// Returns pointer to PNG data (caller must free with pdf_free_image)
/// Length is written to length_out, error code to error_out
uint8_t* pdf_render_page(
    uint64_t handle,
    uint16_t page_index,
    float scale,
    uint32_t* length_out,
    int32_t* error_out
);

/// Free image data returned by pdf_render_page
void pdf_free_image(uint8_t* data);

/// Free a string returned by the API
void pdf_free_string(char* str);

#ifdef __cplusplus
}
#endif

#endif // PDFBRIDGE_H
