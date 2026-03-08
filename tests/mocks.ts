import { mockIPC } from '@tauri-apps/api/mocks';

function createMockRenderBytes(scale = 1, size = 16) {
  const scaledSize = Math.max(1, Math.round(size * scale));
  return Array.from({ length: scaledSize }, (_, row) =>
    Array.from(
      { length: scaledSize },
      (_, column) => (((row * scaledSize) + column) * 73) % 256,
    ),
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
        const scale =
          'scale' in payload && typeof payload.scale === 'number'
            ? payload.scale
            : 1;
        return createMockRenderBytes(scale);
      }
    }
  });
}
