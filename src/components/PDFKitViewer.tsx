import { invoke } from '@tauri-apps/api/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { usePdfBackend } from '../context/PdfBackendContext';

interface PDFKitViewerProps {
  filePath: string;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

interface PageDimensions {
  width: number;
  height: number;
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

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
`;

// Scale for display (the actual render is 2x this for Retina)
const DISPLAY_SCALE = 1.0;
const BUFFER_PAGES = 2; // Pages to pre-render above/below viewport

export default function PDFKitViewer({
  filePath,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFKitViewerProps) {
  const { backend } = usePdfBackend();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [pageCount, setPageCount] = useState(0);
  const [pageDimensions, setPageDimensions] = useState<PageDimensions[]>([]);
  const [renderedPages, setRenderedPages] = useState<Map<number, string>>(new Map());
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([0]));
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load document metadata and page dimensions
  useEffect(() => {
    const loadDocument = async () => {
      try {
        // Load metadata
        const metadata = await invoke<PdfMetadata>('load_pdf', {
          filePath,
          backend,
        });
        
        setPageCount(metadata.page_count);
        onDocumentLoadSuccess({ numPages: metadata.page_count });

        // Load all page dimensions (this is fast, just metadata)
        const dimensions: PageDimensions[] = [];
        for (let i = 0; i < metadata.page_count; i++) {
          const pageInfo = await invoke<PageInfo>('get_page_info', {
            filePath,
            pageIndex: i,
            backend,
          });
          dimensions.push({
            width: pageInfo.width * DISPLAY_SCALE,
            height: pageInfo.height * DISPLAY_SCALE,
          });
        }
        setPageDimensions(dimensions);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    loadDocument();
  }, [filePath, backend, onDocumentLoadSuccess]);

  // Set up IntersectionObserver for lazy loading
  useEffect(() => {
    if (pageCount === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisible = new Set(visiblePages);
        let changed = false;

        entries.forEach((entry) => {
          const pageIndex = parseInt(entry.target.getAttribute('data-page') || '0', 10);
          
          if (entry.isIntersecting) {
            newVisible.add(pageIndex);
            changed = true;
          } else {
            // Keep rendered pages in cache, just track visibility
            newVisible.delete(pageIndex);
            changed = true;
          }
        });

        if (changed) {
          setVisiblePages(newVisible);
          
          // Update current page (first visible)
          const sortedVisible = Array.from(newVisible).sort((a, b) => a - b);
          if (sortedVisible.length > 0) {
            onPageChange(sortedVisible[0] + 1);
          }
        }
      },
      {
        root: containerRef.current,
        rootMargin: '200px 0px', // Pre-load pages 200px before they're visible
        threshold: 0.1,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [pageCount, onPageChange]);

  // Observe page elements
  const setPageRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      pageRefs.current.set(index, element);
      observerRef.current?.observe(element);
    } else {
      const existing = pageRefs.current.get(index);
      if (existing) {
        observerRef.current?.unobserve(existing);
        pageRefs.current.delete(index);
      }
    }
  }, []);

  // Render visible pages + buffer
  useEffect(() => {
    const pagesToRender = new Set<number>();
    
    visiblePages.forEach((pageIndex) => {
      // Add visible page
      pagesToRender.add(pageIndex);
      
      // Add buffer pages
      for (let i = 1; i <= BUFFER_PAGES; i++) {
        if (pageIndex - i >= 0) pagesToRender.add(pageIndex - i);
        if (pageIndex + i < pageCount) pagesToRender.add(pageIndex + i);
      }
    });

    // Render pages that aren't already rendered or loading
    pagesToRender.forEach(async (pageIndex) => {
      if (renderedPages.has(pageIndex) || loadingPages.has(pageIndex)) {
        return;
      }

      setLoadingPages((prev) => new Set(prev).add(pageIndex));

      try {
        const base64 = await invoke<string>('render_page_to_base64', {
          filePath,
          pageIndex,
          scale: DISPLAY_SCALE,
          backend,
        });

        setRenderedPages((prev) => new Map(prev).set(pageIndex, base64));
      } catch (err) {
        console.error(`Failed to render page ${pageIndex}:`, err);
      } finally {
        setLoadingPages((prev) => {
          const next = new Set(prev);
          next.delete(pageIndex);
          return next;
        });
      }
    });
  }, [visiblePages, pageCount, filePath, backend, renderedPages, loadingPages]);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  if (pageDimensions.length === 0) {
    return <div style={{ padding: '20px' }}>Loading document...</div>;
  }

  return (
    <Container ref={containerRef}>
      {pageDimensions.map((dims, index) => (
        <PageContainer
          key={index}
          ref={(el) => setPageRef(index, el)}
          data-page={index}
          $width={dims.width}
          $height={dims.height}
        >
          {renderedPages.has(index) ? (
            <PageImage
              src={renderedPages.get(index)}
              alt={`Page ${index + 1}`}
            />
          ) : (
            <PagePlaceholder>
              {loadingPages.has(index) ? 'Rendering...' : `Page ${index + 1}`}
            </PagePlaceholder>
          )}
          
          {loadingPages.has(index) && (
            <LoadingOverlay>
              <PagePlaceholder>Rendering...</PagePlaceholder>
            </LoadingOverlay>
          )}
          
          <PageNumber>{index + 1}</PageNumber>
        </PageContainer>
      ))}
    </Container>
  );
}

