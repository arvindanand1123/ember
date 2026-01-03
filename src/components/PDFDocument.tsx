import PDFKitViewer from './PDFKitViewer';

interface PDFDocumentViewerProps {
  filePath: string;
  numPages: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onPageChange: (page: number) => void;
}

export default function PDFDocumentViewer({
  filePath,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFDocumentViewerProps) {
  return (
    <PDFKitViewer
      filePath={filePath}
      onDocumentLoadSuccess={onDocumentLoadSuccess}
      onPageChange={onPageChange}
    />
  );
}
