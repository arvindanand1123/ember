import { useEffect, useRef, useState } from 'react';
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
  const menuHandleRef = useRef<AppMenuHandle | null>(null);
  const filePathRef = useRef<string | null>(filePath);

  const handleBack = useStable(() => setFilePath(null));

  useEffect(() => {
    filePathRef.current = filePath;
    void menuHandleRef.current?.setDocumentActionsEnabled(Boolean(filePath));
  }, [filePath]);

  useOnMount(
    () => {
      let disposed = false;

      const initializeMenu = async () => {
        try {
          const menuHandle = await setupAppMenu();

          if (disposed) {
            await menuHandle.dispose();
            return;
          }

          menuHandleRef.current = menuHandle;
          await menuHandle.setDocumentActionsEnabled(Boolean(filePathRef.current));
        } catch (error) {
          console.error('Failed to set up app menu', error);
        }
      };

      void initializeMenu();

      return () => {
        disposed = true;
        const menuHandle = menuHandleRef.current;
        menuHandleRef.current = null;

        if (menuHandle) {
          void menuHandle.dispose();
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
