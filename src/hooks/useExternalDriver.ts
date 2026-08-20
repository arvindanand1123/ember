import { save } from '@tauri-apps/plugin-dialog';

import { useStable } from './useStable';

export function useExternalDriver() {
  const addPath = useStable(
    (targetPath: string): Promise<string | null> => {
      return save({
        defaultPath: targetPath,
        filters: [{
          name: 'PDF',
          extensions: ['pdf'],
        }],
      });
    },
  );
  return { addPath };
}
