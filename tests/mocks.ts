import { readFile } from 'node:fs/promises';

import { mockIPC } from '@tauri-apps/api/mocks';

export function setupTauriMocks(dialogFilePath: string | null = null) {
  mockIPC(async (cmd, payload) => {
    // Handle event plugin commands
    if (cmd === 'plugin:event|listen') {
      return 1;
    }
    if (cmd === 'plugin:event|unlisten') {
      return null;
    }
    if (cmd === 'plugin:dialog|open') {
      return dialogFilePath;
    }

    if (cmd === 'load_pdf' || cmd === 'get_page_info' || cmd === 'render_page_to_base64') {
      if (!payload || !('filePath' in payload)) {
        throw new Error(`${cmd}: filePath is required`);
      }
      const filePath = payload.filePath as string;

      // eslint-disable-next-line
      const scale = 'scale' in payload ? (payload.scale as number) : null;

      if (cmd === 'load_pdf') {
        return { page_count: 1, title: 'Title', author: null };
      }

      if (!('pageIndex' in payload)) {
        throw new Error(`${cmd}: pageIndex is required`);
      }
      const pageIndex = payload.pageIndex as number;

      if (cmd === 'get_page_info') {
        return { page_index: pageIndex, width: 612, height: 792 };
      }

      if (cmd === 'render_page_to_base64') {
        const file = await readFile(filePath).catch(() => null);
        let data: string;
        if (file) {
          data = `data:image/png;base64,${file.toString('base64')}`;
        } else {
          data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        }
        return data;
      }
    }
  });
}
