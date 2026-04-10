import { clearMocks as clearTauriApiMocks, mockIPC } from '@tauri-apps/api/mocks';
import { vi } from 'vitest';

interface MockProfilingEvent {
  id: number;
  name: string;
  startedAtMs: number;
  endedAtMs: number;
  durationMs: number;
  startMemory: { rssBytes: number; virtualBytes: number } | null;
  endMemory: { rssBytes: number; virtualBytes: number } | null;
  details: Record<string, unknown>;
}

interface SetupTauriMockOptions {
  dialogFilePath?: string | null;
  profilingSnapshot?: {
    sessionId: number;
    events: MockProfilingEvent[];
  };
}

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

export function setupTauriMocks(options: SetupTauriMockOptions = {}) {
  const dialogFilePath = options.dialogFilePath ?? null;
  const profilingSnapshot = options.profilingSnapshot ?? {
    sessionId: 0,
    events: [],
  };
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

    if (cmd === 'profiling_get_snapshot') {
      return profilingSnapshot;
    }
    if (cmd === 'profiling_start_trace' || cmd === 'profiling_end_trace' || cmd === 'profiling_reset') {
      return null;
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
