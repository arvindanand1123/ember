import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { Container, GlobalStyles, theme } from './components';
import { useStable } from './hooks/useStable';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);

  const handleBack = useStable(() => setFilePath(null));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <Container>
        {!filePath ? (
          <FileSelectorPage onFileSelected={setFilePath}/>
        ) : (
          <PDFViewerPage filePath={filePath} onBack={handleBack}/>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
