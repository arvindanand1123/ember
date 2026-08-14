import { useCallback, useEffect, useState } from 'react';

import { APP_MENU_SAVE_AS_EVENT, APP_MENU_SAVE_EVENT } from '../appMenu';
import { CommandInput, PDFControls, PDFDocument, PDFViewer } from '../components';
import { useExternalDriver } from '../hooks/useExternalDriver';
import { useInternalDriver } from '../hooks/useInternalDriver';
import { useOnMount } from '../hooks/useOnMount';
import { useStable } from '../hooks/useStable';

interface PDFViewerPageProps {
  filePath: string;
  onBack: () => void;
  onFilePathChange: (filePath: string) => void;
}

type SaveFeedback = {
  message: string;
  tone: 'success' | 'danger';
};

function getFileName(filePath: string) {
  return filePath.split(/[\\/]/).pop() || filePath;
}

export default function PDFViewerPage({ filePath, onBack, onFilePathChange }: PDFViewerPageProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);
  const { savePdf } = useInternalDriver();
  const { addPath } = useExternalDriver();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, [setNumPages]);

  const handleRotate = useCallback(() => {
    setRotation((currentRotation) => (currentRotation + 90) % 360);
  }, []);

  useEffect(() => {
    if (!saveFeedback) return undefined;

    const timeout = window.setTimeout(() => {
      setSaveFeedback(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [saveFeedback]);

  const handleSave = useStable(async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const savedPath = await savePdf(filePath, filePath);
      setSaveFeedback({
        message: `Saved ${getFileName(savedPath)}`,
        tone: 'success',
      });
    } catch (error) {
      setSaveFeedback({
        message: error instanceof Error ? error.message : 'Unable to save PDF',
        tone: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  });

  const handleSaveAs = useStable(async () => {
    if (isSaving) return;

    try {
      const targetPath = await addPath(filePath);

      if (!targetPath) return;

      setIsSaving(true);
      setSaveFeedback(null);

      const savedPath = await savePdf(filePath, targetPath);
      onFilePathChange(savedPath);
      setSaveFeedback({
        message: `Saved as ${getFileName(savedPath)}`,
        tone: 'success',
      });
    } catch (error) {
      setSaveFeedback({
        message: error instanceof Error ? error.message : 'Unable to save PDF',
        tone: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  });

  useOnMount(() => {
    const onMenuSave = () => {
      void handleSave();
    };
    const onMenuSaveAs = () => {
      void handleSaveAs();
    };

    window.addEventListener(APP_MENU_SAVE_EVENT, onMenuSave);
    window.addEventListener(APP_MENU_SAVE_AS_EVENT, onMenuSaveAs);

    return () => {
      window.removeEventListener(APP_MENU_SAVE_EVENT, onMenuSave);
      window.removeEventListener(APP_MENU_SAVE_AS_EVENT, onMenuSaveAs);
    };
  });

  return (
    <PDFViewer>
      <PDFControls
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        saveMessage={saveFeedback?.message}
        onBack={onBack}
        onRotate={handleRotate}
        onZoomChange={setZoom}
      />
      <PDFDocument
        filePath={filePath}
        rotation={rotation}
        zoom={zoom}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onPageChange={setCurrentPage}
      />
      <CommandInput/>
    </PDFViewer>
  );
}
