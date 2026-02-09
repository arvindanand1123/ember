import { type RefObject, useEffect } from 'react';

import { useStable } from './useStable';

interface UseCurrentPdfPageOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  onPageChange: (page: number) => void;
}

export function useCurrentPdfPage({
  containerRef,
  enabled,
  onPageChange,
}: UseCurrentPdfPageOptions) {
  const stableOnPageChange = useStable(onPageChange);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const getCurrentPage = () => {
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

      return currentPage;
    };

    const handleScroll = () => {
      stableOnPageChange(getCurrentPage());
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, enabled, stableOnPageChange]);
}
