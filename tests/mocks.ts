import { readFile } from 'node:fs/promises';

import { mockIPC } from '@tauri-apps/api/mocks';

function createMockRenderBytes(size = 16) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => ((row * size) + column) * 73 % 256),
  ).flat();
}

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
        return file ? Array.from(Uint8Array.from(file)) : createMockRenderBytes();
      }
    }
  });
}
