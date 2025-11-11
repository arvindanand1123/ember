import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { ThemeProvider } from 'styled-components';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';
import { GlobalStyles, theme, Container } from './components';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container>
        {!pdfUrl ? (
          <FileSelectorPage onFileSelected={setPdfUrl} />
        ) : (
          <PDFViewerPage pdfUrl={pdfUrl} onBack={() => setPdfUrl(null)} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
