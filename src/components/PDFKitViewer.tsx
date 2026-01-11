import { invoke } from '@tauri-apps/api/core';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface PDFKitViewerProps {
  filePath: string;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

interface PdfMetadata {
  page_count: number;
  title?: string;
  author?: string;
}

interface PageInfo {
  page_index: number;
  width: number;
  height: number;
}

interface PageData {
  width: number;
  height: number;
  imageData: string | null;
}

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const PageContainer = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  background: #2a2a2a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const PageImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const PagePlaceholder = styled.div`
  color: #666;
  font-size: 14px;
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const DISPLAY_SCALE = 1.0;

export default function PDFKitViewer({
  filePath,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFKitViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);

        // Load metadata
        const metadata = await invoke<PdfMetadata>('load_pdf', { filePath });
        onDocumentLoadSuccess({ numPages: metadata.page_count });

        // Load all pages
        const loadedPages: PageData[] = [];

        for (let i = 0; i < metadata.page_count; i++) {
          // Get page dimensions
          const pageInfo = await invoke<PageInfo>('get_page_info', {
            filePath,
            pageIndex: i,
          });

          // Render page
          const imageData = await invoke<string>('render_page_to_base64', {
            filePath,
            pageIndex: i,
            scale: DISPLAY_SCALE,
          });

          loadedPages.push({
            width: pageInfo.width * DISPLAY_SCALE,
            height: pageInfo.height * DISPLAY_SCALE,
            imageData,
          });
        }

        setPages(loadedPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [filePath, onDocumentLoadSuccess]);

  // Track scroll position for page change callback
  useEffect(() => {
    const container = containerRef.current;
    if (!container || pages.length === 0) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let currentPage = 1;
      const pageElements = container.querySelectorAll('[data-page]');

      pageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= containerCenter) {
          currentPage = parseInt(el.getAttribute('data-page') || '0', 10) + 1;
        }
      });

      onPageChange(currentPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pages, onPageChange]);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading document...</div>;
  }

  return (
    <Container ref={containerRef}>
      {pages.map((page, index) => (
        <PageContainer
          key={index}
          data-page={index}
          $width={page.width}
          $height={page.height}
        >
          {page.imageData ? (
            <PageImage src={page.imageData} alt={`Page ${index + 1}`}/>
          ) : (
            <PagePlaceholder>Page {index + 1}</PagePlaceholder>
          )}
          <PageNumber>{index + 1}</PageNumber>
        </PageContainer>
      ))}
    </Container>
  );
}
