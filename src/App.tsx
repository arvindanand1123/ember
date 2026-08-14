import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { type AppMenuHandle, setupAppMenu } from './appMenu';
import { GlobalStyles, theme, TitleBar } from './components';
import { Container, type ContainerSpec } from './components/Container';
import { useOnMount } from './hooks/useOnMount';
import { useStable } from './hooks/useStable';
import FileSelectorPage from './pages/FileSelectorPage';
import PDFViewerPage from './pages/PDFViewerPage';

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [menuHandle, setMenuHandle] = useState<AppMenuHandle | null>(null);

  const handleBack = useStable(() => setFilePath(null));

  useEffect(() => {
    void menuHandle?.setDocumentActionsEnabled(Boolean(filePath));
  }, [menuHandle, filePath]);

  useOnMount(
    () => {
      let disposed = false;
      let handle: AppMenuHandle | null = null;

      const initializeMenu = async () => {
        try {
          handle = await setupAppMenu();

          if (disposed) {
            await handle.dispose();
            handle = null;
            return;
          }

          setMenuHandle(handle);
        } catch (error) {
          console.error('Failed to set up app menu', error);
        }
      };

      void initializeMenu();

      return () => {
        disposed = true;
        setMenuHandle(null);

        if (handle) {
          void handle.dispose();
        }
      };
    },
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <AppShell>
        <TitleBar filePath={filePath}/>
        {!filePath ? (
          <FileSelectorPage onFileSelected={setFilePath}/>
        ) : (
          <PDFViewerPage
            filePath={filePath}
            onBack={handleBack}
            onFilePathChange={setFilePath}
          />
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
