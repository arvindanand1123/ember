import { save } from '@tauri-apps/plugin-dialog';
import { useCallback } from 'react';

export function useExternalDriver() {
  const addPath = useCallback(
    (targetPath: string): Promise<string | null> => {
      return save({
        defaultPath: targetPath,
        filters: [{
          name: 'PDF',
          extensions: ['pdf'],
        }],
      });
    }, [],
  );
  return { addPath };
}
