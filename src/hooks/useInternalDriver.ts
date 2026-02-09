import { invoke } from '@tauri-apps/api/core';
import { useCallback } from 'react';

export interface PdfMetadata {
  page_count: number;
  title?: string;
  author?: string;
}

export interface PageInfo {
  page_index: number;
  width: number;
  height: number;
}

export function useInternalDriver() {
  const loadPdf = useCallback(
    (filePath: string): Promise<PdfMetadata> =>
      invoke<PdfMetadata>('load_pdf', { filePath }),
    [],
  );

  const getPageInfo = useCallback(
    (filePath: string, pageIndex: number): Promise<PageInfo> =>
      invoke<PageInfo>('get_page_info', { filePath, pageIndex }),
    [],
  );

  const renderPageToBase64 = useCallback(
    (filePath: string, pageIndex: number, scale: number): Promise<string> =>
      invoke<string>('render_page_to_base64', { filePath, pageIndex, scale }),
    [],
  );

  return {
    loadPdf,
    getPageInfo,
    renderPageToBase64,
  };
}
