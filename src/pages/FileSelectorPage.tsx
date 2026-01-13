import { open } from '@tauri-apps/plugin-dialog';

import { FileSelector, SelectFileButton } from '../components';
import { useStable } from '../hooks/useStable';

interface FileSelectorPageProps {
  onFileSelected: (url: string) => void;
}

export default function FileSelectorPage({ onFileSelected }: FileSelectorPageProps) {
  const handleSelectFile = useStable(async () => {
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
  });

  return (
    <FileSelector>
      <SelectFileButton onClick={handleSelectFile}>
        Select File
      </SelectFileButton>
    </FileSelector>
  );
}
