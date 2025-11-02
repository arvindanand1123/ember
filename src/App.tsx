import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <main className="container">
      {!pdfUrl ? (
        <FileSelectorPage onFileSelected={setPdfUrl} />
      ) : (
        <PDFViewerPage pdfUrl={pdfUrl} onBack={() => setPdfUrl(null)} />
      )}
    </main>
  );
}

export default App;
