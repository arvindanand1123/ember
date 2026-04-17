import { invoke } from '@tauri-apps/api/core';
import { useCallback } from 'react';

export function useInternalDriver() {
  const savePdf = useCallback(
    (sourcePath: string, targetPath: string): Promise<string> =>
      invoke<string>('save_pdf', { sourcePath, targetPath }),
    [],
  );

  const loadPdf = useCallback(
    (filePath: string): Promise<{
      page_count: number;
      title?: string;
      author?: string;
    }> =>
      invoke<{
        page_count: number;
        title?: string;
        author?: string;
      }>('load_pdf', { filePath }),
    [],
  );

  const getPageInfo = useCallback(
    (filePath: string, pageIndex: number): Promise<{
      page_index: number;
      width: number;
      height: number;
    }> =>
      invoke<{
        page_index: number;
        width: number;
        height: number;
      }>('get_page_info', { filePath, pageIndex }),
    [],
  );

  const renderPage = useCallback(
    (filePath: string, pageIndex: number, scale: number): Promise<Uint8Array> =>
      invoke<number[]>('render_page', { filePath, pageIndex, scale })
        .then((pngBytes) => Uint8Array.from(pngBytes)),
    [],
  );

  return {
    savePdf,
    loadPdf,
    getPageInfo,
    renderPage,
  };
}
