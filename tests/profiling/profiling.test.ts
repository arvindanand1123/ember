import { clearMocks as clearTauriApiMocks, mockIPC } from '@tauri-apps/api/mocks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearMocks, setupTauriMocks } from '../mocks';

describe('profiling module', () => {
  beforeEach(() => {
    vi.resetModules();
    setupTauriMocks({
      profilingSnapshot: {
        sessionId: 9,
        events: [
          {
            id: 1,
            name: 'renderPage:page:1',
            startedAtMs: 1000,
            endedAtMs: 1050,
            durationMs: 50,
            startMemory: null,
            endMemory: null,
            details: {},
          },
        ],
      },
    });
  });

  afterEach(() => {
    clearMocks();
    vi.unstubAllEnvs();
  });

  it('profiling is not enabled', async () => {
    vi.unstubAllEnvs();
    clearTauriApiMocks();
    const ipcHandler = vi.fn();
    mockIPC(ipcHandler);
    const profilingModule = await import('../../src/profiling/profiling');

    expect(profilingModule.isProfilingEnabled()).toBe(false);
    await expect(
      profilingModule.profiling.startTrace({ name: 'renderPage' }),
    ).resolves.toBeUndefined();
    await expect(
      profilingModule.profiling.endTrace({ name: 'renderPage' }),
    ).resolves.toBeUndefined();
    await expect(profilingModule.resetProfilingEvents()).resolves.toBeUndefined();
    await expect(profilingModule.getProfilingSnapshot()).resolves.toEqual({
      sessionId: 0,
      events: [],
    });
    expect(ipcHandler).not.toHaveBeenCalled();
  });
});
