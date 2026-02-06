import { invoke } from '@tauri-apps/api/core';
import { useCallback, useState } from 'react';

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

export function usePdf() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPdf = useCallback(
    async (filePath: string): Promise<PdfMetadata | null> => {
      setLoading(true);
      setError(null);
      try {
        const metadata = await invoke<PdfMetadata>('load_pdf', { filePath });
        return metadata;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getPageInfo = useCallback(
    async (filePath: string, pageIndex: number): Promise<PageInfo | null> => {
      setLoading(true);
      setError(null);
      try {
        const pageInfo = await invoke<PageInfo>('get_page_info', {
          filePath,
          pageIndex,
        });
        return pageInfo;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const renderPageToBase64 = useCallback(
    async (
      filePath: string,
      pageIndex: number,
      scale?: number,
    ): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const base64Image = await invoke<string>('render_page_to_base64', {
          filePath,
          pageIndex,
          scale,
        });
        return base64Image;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loadPdf,
    getPageInfo,
    renderPageToBase64,
    loading,
    error,
  };
}
