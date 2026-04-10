import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { Container, type ContainerSpec } from './components/Container';
import { GlobalStyles, theme, TitleBar } from './components';
import { useStable } from './hooks/useStable';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);

  const handleBack = useStable(() => setFilePath(null));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <AppShell>
        <TitleBar filePath={filePath}/>
        {!filePath ? (
          <FileSelectorPage onFileSelected={setFilePath}/>
        ) : (
          <PDFViewerPage filePath={filePath} onBack={handleBack}/>
        )}
      </AppShell>
    </ThemeProvider>
  );
}

export default App;

const appShellSpec = {
  width: '100%',
  height: '100vh',
  stackType: 'col',
  overflow: 'hidden',
} satisfies ContainerSpec;

const AppShell = Container.build(appShellSpec);
