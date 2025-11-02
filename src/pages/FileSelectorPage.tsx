import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';

interface FileSelectorPageProps {
  onFileSelected: (url: string) => void;
}

export default function FileSelectorPage({ onFileSelected }: FileSelectorPageProps) {
  const handleSelectFile = async () => {
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
        const response = await invoke<string>('load_pdf', { filePath: selected });
        console.log('Response from Rust:', response);
        const url = convertFileSrc(selected);
        onFileSelected(url);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  return (
    <div className="file-selector">
      <button onClick={handleSelectFile} className="select-file-button">
        Select File
      </button>
    </div>
  );
}
