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

type MenuKind = 'Menu' | 'Submenu' | 'MenuItem' | 'Predefined';

interface MenuNewPayload {
  kind: MenuKind;
  options?: {
    id?: string;
    text?: string;
    item?: string;
    items?: [number, MenuKind][];
  };
}

export interface MenuSnapshot {
  kind: MenuKind;
  text: string;
  items?: MenuSnapshot[];
}

export function setupTauriMocks(dialogFilePath: string | null = null) {
  const menuNodes = new Map<number, MenuSnapshot & { itemRids: number[] }>();
  let nextMenuRid = 1;
  let appMenuRid: number | null = null;

  function getAppMenu(): MenuSnapshot[] | null {
    function r(rid: number): MenuSnapshot {
      const node = menuNodes.get(rid);
      if (!node) {
        throw new Error(`unknown menu rid ${rid}`);
      }
      const { kind, text, itemRids } = node;
      return itemRids.length > 0
        ? { kind, text, items: itemRids.map(r) }
        : { kind, text };
    }
    if (appMenuRid == null){
      return null;
    } else {
      const snapshotMenu = r(appMenuRid);
      return snapshotMenu.items ?? [];
    }
  }

  let objectUrlIndex = 0;
  const createObjectURLMock = vi.fn(() => `blob:render-${++objectUrlIndex}`);
  const revokeObjectURLMock = vi.fn();

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
    const args = (payload ?? {}) as Record<string, unknown>;

    if (cmd === 'plugin:event|listen') {
      return 1;
    }
    if (cmd === 'plugin:event|unlisten') {
      return null;
    }
    if (cmd === 'plugin:dialog|open') {
      return dialogFilePath;
    }

    if (cmd === 'plugin:menu|new') {
      const { kind, options } = payload as unknown as MenuNewPayload;
      const rid = nextMenuRid++;

      menuNodes.set(rid, {
        kind,
        text: options?.text ?? options?.item ?? '',
        itemRids: (options?.items ?? []).map(([itemRid]) => itemRid),
      });

      return [rid, options?.id ?? `menu-item-${rid}`];
    }
    if (cmd === 'plugin:menu|set_as_app_menu') {
      appMenuRid = args.rid as number;
      return null;
    }
    if (cmd === 'plugin:menu|set_enabled' || cmd === 'plugin:resources|close') {
      return null;
    }

    if (cmd === 'load_pdf') {
      return { page_count: 1, title: 'Title', author: null };
    }
    if (cmd === 'get_page_info') {
      return { page_index: args.pageIndex as number, width: 612, height: 792 };
    }
    if (cmd === 'render_page') {
      const scale = typeof args.scale === 'number' ? args.scale : 1;
      return createMockRenderBytes(scale);
    }
  });

  return { getAppMenu, revokeObjectURLMock };
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
