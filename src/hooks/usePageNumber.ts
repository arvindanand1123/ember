import { useRef } from 'react';

export function usePageNumber() {
  const containerRef = useRef<HTMLDivElement>(null);

  const getCurrentPage = () => {
    const container = containerRef.current;

    if (!container) {
      return 1;
    }

    const pages = container.querySelectorAll('.pdf-page');

    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const centerY = containerTop + containerHeight / 2;

    let closestPage = 1;
    let closestDistance = Infinity;

    pages.forEach((page, index) => {
      const pageElement = page as HTMLElement;
      const pageTop = pageElement.offsetTop;
      const pageHeight = pageElement.offsetHeight;
      const pageCenter = pageTop + pageHeight / 2;

      const distance = Math.abs(pageCenter - centerY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = index + 1;
      }
    });

    return closestPage;
  };

  return { containerRef, getCurrentPage };
}
