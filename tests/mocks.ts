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

    if (cmd === 'load_pdf' || cmd === 'get_page_info' || cmd === 'render_page') {
      if (!payload || !('filePath' in payload)) {
        throw new Error(`${cmd}: filePath is required`);
      }
      const filePath = payload.filePath as string;

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

      if (cmd === 'render_page') {
        const file = await readFile(filePath).catch(() => null);
        let data: Uint8Array;
        if (file) {
          data = Uint8Array.from(file);
        } else {
          data = Uint8Array.from([
            137, 80, 78, 71, 13, 10, 26, 10,
            0, 0, 0, 13, 73, 72, 68, 82,
            0, 0, 0, 1, 0, 0, 0, 1,
            8, 6, 0, 0, 0, 31, 21, 196,
            137, 0, 0, 0, 13, 73, 68, 65,
            84, 120, 218, 99, 100, 248, 207, 80,
            15, 0, 3, 134, 1, 128, 90, 52,
            125, 107, 0, 0, 0, 0, 73, 69,
            78, 68, 174, 66, 96, 130,
          ]);
        }
        return data;
      }
    }
  });
}
