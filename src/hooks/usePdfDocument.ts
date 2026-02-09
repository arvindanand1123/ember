import { useEffect, useState } from 'react';

import { type DocumentData, usePdf } from './usePdf';
import { useStable } from './useStable';

export function usePdfDocument({
  filePath,
  zoom,
  onDocumentLoadSuccess,
}: {
  filePath: string;
  zoom: number;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
}) {
  const [pdfData, setPdfData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stableOnDocumentLoadSuccess = useStable(onDocumentLoadSuccess);
  const { getRenderedDocument } = usePdf();

  useEffect(() => {
    let isStale = false;

    const loadDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const renderedDocument = await getRenderedDocument(filePath, zoom);
        if (isStale) return;

        stableOnDocumentLoadSuccess({ numPages: renderedDocument.pageCount });
        setPdfData(renderedDocument);
      } catch (err) {
        if (!isStale) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!isStale) {
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isStale = true;
    };
  }, [filePath, zoom, stableOnDocumentLoadSuccess, getRenderedDocument]);

  return {
    pdfData,
    loading,
    error,
  };
}
