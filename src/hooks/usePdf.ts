import { useCallback } from 'react';

import { useInternalDriver } from './useInternalDriver';

export interface PageData {
  index: number;
  width: number;
  height: number;
  imageData: string;
}

export interface DocumentData {
  pageCount: number;
  title?: string;
  author?: string;
  pages: PageData[];
}

export function usePdf() {
  const { loadPdf, getPageInfo, renderPageToBase64 } = useInternalDriver();

  const getPageNumbers = useCallback(
    async (filePath: string): Promise<number[]> => {
      const metadata = await loadPdf(filePath);
      return Array.from({ length: metadata.page_count }, (_, i) => i);
    },
    [loadPdf],
  );

  const getRenderedPages = useCallback(
    async (
      filePath: string,
      pageNumbers: number[],
      zoom: number,
    ): Promise<PageData[]> => {
      const scale = zoom / 100;
      const pages: PageData[] = await Promise.all(pageNumbers.map(async (pageNumber) => {
        const pageInfo = await getPageInfo(filePath, pageNumber);
        const imageData = await renderPageToBase64(filePath, pageNumber, scale);
        return {
          index: pageNumber,
          width: pageInfo.width * scale,
          height: pageInfo.height * scale,
          imageData,
        };
      }));
      return pages;
    },
    [getPageInfo, renderPageToBase64],
  );

  const getRenderedDocument = useCallback(
    async (filePath: string, zoom: number): Promise<DocumentData> => {
      const pageNumbers = await getPageNumbers(filePath);
      const pages = await getRenderedPages(filePath, pageNumbers, zoom);

      return {
        pageCount: pageNumbers.length,
        pages,
      };
    },
    [getPageNumbers, getRenderedPages],
  );

  return {
    getPageNumbers,
    getRenderedPages,
    getRenderedDocument,
  };
}
