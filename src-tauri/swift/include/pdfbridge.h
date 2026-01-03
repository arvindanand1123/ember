#ifndef PDFBRIDGE_H
#define PDFBRIDGE_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef void* PDFDocumentHandle;

typedef enum {
    PDF_SUCCESS = 0,
    PDF_ERROR_INVALID_PATH = 1,
    PDF_ERROR_LOAD_FAILED = 2,
    PDF_ERROR_PAGE_NOT_FOUND = 3,
    PDF_ERROR_RENDER_FAILED = 4,
    PDF_ERROR_NULL_HANDLE = 5,
} PDFErrorCode;

typedef struct {
    PDFErrorCode error;
    char* error_message;
} PDFResult;

typedef struct {
    uint16_t page_count;
    char* title;
    char* author;
    char* subject;
    char* creator;
    char* producer;
} PDFMetadata;

typedef struct {
    uint16_t page_index;
    float width;
    float height;
} PDFPageInfo;

typedef struct {
    uint8_t* data;
    uint32_t length;
    PDFErrorCode error;
    char* error_message;
} PDFImageResult;

PDFDocumentHandle pdf_open(const char* path, PDFResult* result);

void pdf_close(PDFDocumentHandle handle);

PDFMetadata pdf_get_metadata(PDFDocumentHandle handle);

uint16_t pdf_page_count(PDFDocumentHandle handle);

PDFPageInfo pdf_get_page_info(PDFDocumentHandle handle, uint16_t page_index, PDFResult* result);

PDFImageResult pdf_render_page(PDFDocumentHandle handle, uint16_t page_index, float scale);

void pdf_free_image(uint8_t* data);

void pdf_free_string(char* str);

#ifdef __cplusplus
}
#endif

#endif

