import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { Container, GlobalStyles, theme } from './components';
import { PdfBackendProvider } from './context/PdfBackendContext';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <PdfBackendProvider>
        <GlobalStyles/>
        <Container>
          {!filePath ? (
            <FileSelectorPage onFileSelected={setFilePath}/>
          ) : (
            <PDFViewerPage filePath={filePath} onBack={() => setFilePath(null)}/>
          )}
        </Container>
      </PdfBackendProvider>
    </ThemeProvider>
  );
}

export default App;
