import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { DragEvent, useEffect, useState } from 'react';

import { ErrorText, FileSelector, HintText, SelectFileButton } from '../components';
import { useStable } from '../hooks/useStable';

interface FileSelectorPageProps {
  onFileSelected: (url: string) => void;
}

export default function FileSelectorPage({ onFileSelected }: FileSelectorPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    listen<{ paths: string[] }>('tauri://drag-drop', (event) => {
      const filePath = event.payload.paths?.[0];
      if (!filePath) return;

      if (filePath.toLowerCase().endsWith('.pdf')) {
        onFileSelected(filePath);
      } else {
        setError('Please drop a PDF file');
        setTimeout(() => setError(null), 3000);
      }
    }).then((fn) => { unlisten = fn; });

    return () => unlisten?.();
  }, [onFileSelected]);

  const handleSelectFile = useStable(async () => {
    try {
      setError(null);
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'PDF',
          extensions: ['pdf'],
        }],
      });

      if (selected) {
        console.log('Selected file:', selected);
        onFileSelected(selected);
      }
    } catch (err) {
      console.error('Error selecting file:', err);
      setError('File picker unavailable on macOS Tahoe. Please drag & drop a PDF.');
    }
  });

  const handleDragOver = useStable((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  });

  const handleDragLeave = useStable((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  });

  const handleDrop = useStable((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  });

  return (
    <FileSelector
      $isDragging={isDragging}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <SelectFileButton onClick={handleSelectFile}>
        Select File
      </SelectFileButton>
      <HintText>or drag and drop a PDF here</HintText>
      {error && <ErrorText>{error}</ErrorText>}
    </FileSelector>
  );
}
