import { open } from '@tauri-apps/plugin-dialog';
import React, { useState } from 'react';

import { type PdfMetadata, usePdfium } from '../hooks/usePdfium';
import { useStable } from '../hooks/useStable';

export function PdfiumExample() {
  const { loadPdf, renderPageToBase64, loading, error } = usePdfium();
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [renderedPage, setRenderedPage] = useState<string | null>(null);

  const handleOpenPdf = useStable(async () => {
    const file = await open({
      multiple: false,
      filters: [
        {
          name: 'PDF',
          extensions: ['pdf'],
        },
      ],
    });

    if (file && typeof file === 'string') {
      setPdfPath(file);

      const meta = await loadPdf(file);
      setMetadata(meta);

      if (meta && meta.page_count > 0) {
        const base64 = await renderPageToBase64(file, 0, 1.5);
        setRenderedPage(base64);
      }
    }
  });

  const handleRenderPage = useStable(async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!pdfPath) return;
    const pageIndex = Number(e.currentTarget.dataset.pageIndex);
    const base64 = await renderPageToBase64(pdfPath, pageIndex, 1.5);
    setRenderedPage(base64);
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pdfium Example</h1>

      <button onClick={handleOpenPdf} disabled={loading}>
        Open PDF
      </button>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {metadata && (
        <div style={{ marginTop: '20px' }}>
          <h2>PDF Metadata</h2>
          <p><strong>Pages:</strong> {metadata.page_count}</p>
          {metadata.title && <p><strong>Title:</strong> {metadata.title}</p>}
          {metadata.author && <p><strong>Author:</strong> {metadata.author}</p>}
          {metadata.subject && <p><strong>Subject:</strong> {metadata.subject}</p>}
          {metadata.creator && <p><strong>Creator:</strong> {metadata.creator}</p>}
          {metadata.producer && <p><strong>Producer:</strong> {metadata.producer}</p>}

          <div style={{ marginTop: '10px' }}>
            {Array.from({ length: metadata.page_count }, (_, i) => (
              <button
                key={i}
                data-page-index={i}
                onClick={handleRenderPage}
                style={{ margin: '5px' }}
              >
                Page {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {renderedPage && (
        <div style={{ marginTop: '20px' }}>
          <h2>Rendered Page</h2>
          <img src={renderedPage} alt="PDF Page" style={{ maxWidth: '100%', border: '1px solid #ccc' }}/>
        </div>
      )}
    </div>
  );
}
