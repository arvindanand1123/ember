import { invoke } from '@tauri-apps/api/core';

import { useStable } from './useStable';

export function useInternalDriver() {
  const savePdf = useStable(
    (sourcePath: string, targetPath: string): Promise<string> =>
      invoke<string>('save_pdf', { sourcePath, targetPath }),
  );

  const loadPdf = useStable(
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
  );

  const getPageInfo = useStable(
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
  );

  const renderPage = useStable(
    (filePath: string, pageIndex: number, scale: number): Promise<Uint8Array> =>
      invoke<number[]>('render_page', { filePath, pageIndex, scale })
        .then((pngBytes) => Uint8Array.from(pngBytes)),
  );

  return {
    savePdf,
    loadPdf,
    getPageInfo,
    renderPage,
  };
}
