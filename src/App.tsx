import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { Container, GlobalStyles, theme } from './components';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <Container>
        {!filePath ? (
          <FileSelectorPage onFileSelected={setFilePath}/>
        ) : (
          <PDFViewerPage filePath={filePath} onBack={() => setFilePath(null)}/>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
