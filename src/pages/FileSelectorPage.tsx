import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from 'react';

import { FileSelector, SelectFileButton } from '../components';

interface FileSelectorPageProps {
  onFileSelected: (url: string) => void;
}

export default function FileSelectorPage({ onFileSelected }: FileSelectorPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unlisten = listen<{ paths: string[] }>('tauri://drag-drop', (event) => {
      const paths = event.payload.paths;
      if (paths && paths.length > 0) {
        const filePath = paths[0];
        if (filePath.toLowerCase().endsWith('.pdf')) {
          console.log('Dropped file:', filePath);
          onFileSelected(filePath);
        } else {
          setError('Please drop a PDF file');
          setTimeout(() => setError(null), 3000);
        }
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [onFileSelected]);

  const handleSelectFile = async () => {
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <FileSelector
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: isDragging ? '2px dashed #4a9eff' : '2px dashed transparent',
        borderRadius: '12px',
        padding: '40px',
        transition: 'all 0.2s ease',
        backgroundColor: isDragging ? 'rgba(74, 158, 255, 0.1)' : 'transparent',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <SelectFileButton onClick={handleSelectFile}>
          Select File
        </SelectFileButton>
        <p style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
          or drag and drop a PDF here
        </p>
        {error && (
          <p style={{ marginTop: '12px', color: '#ff6b6b', fontSize: '13px' }}>
            {error}
          </p>
        )}
      </div>
    </FileSelector>
  );
}
