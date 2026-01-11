import { open } from '@tauri-apps/plugin-dialog';
import { useCallback } from 'react';

import { FileSelector, SelectFileButton } from '../components';

interface FileSelectorPageProps {
  onFileSelected: (url: string) => void;
}

export default function FileSelectorPage({ onFileSelected }: FileSelectorPageProps) {
  const handleSelectFile = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  }, [onFileSelected]);

  return (
    <FileSelector>
      <SelectFileButton onClick={handleSelectFile}>
        Select File
      </SelectFileButton>
    </FileSelector>
  );
}
