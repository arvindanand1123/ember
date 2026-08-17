import { clearMocks as clearTauriApiMocks, mockIPC } from '@tauri-apps/api/mocks';
import { vi } from 'vitest';

function createMockRenderBytes(scale = 1, size = 16) {
  const scaledSize = Math.max(1, Math.round(size * scale));
  return Array.from({ length: scaledSize }, (_, row) =>
    Array.from(
      { length: scaledSize },
      (_, column) => (((row * scaledSize) + column) * 73) % 256,
    ),
  ).flat();
}

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

let createObjectURLMock: ReturnType<typeof vi.fn>;
let revokeObjectURLMock: ReturnType<typeof vi.fn>;
let nextMenuRid = 1;

export function setupTauriMocks(
  dialogFilePath: string | null = null,
  saveDialogFilePath: string | null = null,
) {
  nextMenuRid = 1;
  let objectUrlIndex = 0;
  createObjectURLMock = vi.fn(() => `blob:render-${++objectUrlIndex}`);
  revokeObjectURLMock = vi.fn();

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: createObjectURLMock,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: revokeObjectURLMock,
  });

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
    if (cmd === 'plugin:dialog|save') {
      return saveDialogFilePath;
    }
    if (cmd === 'plugin:menu|new') {
      const options =
        payload && 'options' in payload
          ? (payload.options as { id?: string } | undefined)
          : undefined;
      return [nextMenuRid++, options?.id ?? `menu-item-${nextMenuRid}`];
    }
    if (cmd === 'plugin:menu|set_as_app_menu' || cmd === 'plugin:menu|set_enabled') {
      return null;
    }
    if (cmd === 'plugin:resources|close') {
      return null;
    }

    if (cmd === 'save_pdf') {
      if (!payload || !('sourcePath' in payload) || !('targetPath' in payload)) {
        throw new Error('save_pdf: sourcePath and targetPath are required');
      }
      return vi.fn((_sourcePath: string, targetPath: string) =>
        targetPath.toLowerCase().endsWith('.pdf') ? targetPath : `${targetPath}.pdf`,
      );
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

  return {
    createObjectURLMock,
    revokeObjectURLMock,
  };
}

export function clearMocks() {
  clearTauriApiMocks();
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: originalCreateObjectURL,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: originalRevokeObjectURL,
  });
}
