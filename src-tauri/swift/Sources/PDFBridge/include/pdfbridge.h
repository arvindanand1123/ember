#ifndef PDFBRIDGE_H
#define PDFBRIDGE_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define PDF_SUCCESS 0
#define PDF_ERROR_INVALID_PATH 1
#define PDF_ERROR_LOAD_FAILED 2
#define PDF_ERROR_PAGE_NOT_FOUND 3
#define PDF_ERROR_RENDER_FAILED 4
#define PDF_ERROR_NULL_HANDLE 5

uint64_t pdf_open(const char* path, int32_t* error_out);

void pdf_close(uint64_t handle);

uint16_t pdf_page_count(uint64_t handle);

char* pdf_get_title(uint64_t handle);

char* pdf_get_author(uint64_t handle);

float pdf_get_page_width(uint64_t handle, uint16_t page_index);

float pdf_get_page_height(uint64_t handle, uint16_t page_index);

uint8_t* pdf_render_page(
    uint64_t handle,
    uint16_t page_index,
    float scale,
    uint32_t* length_out,
    int32_t* error_out
);

void pdf_free_image(uint8_t* data);

void pdf_free_string(char* str);

#ifdef __cplusplus
}
#endif

#endif
