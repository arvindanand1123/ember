import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearMocks, setupTauriMocks } from '../mocks';

let ProfilerApp: typeof import('../../src/profiling/ProfilerApp').default;

beforeEach(() => {
  vi.stubEnv('VITE_PROFILE', '1');
  setupTauriMocks({
    profilingSnapshot: {
      sessionId: 3,
      events: [
        {
          id: 1,
          name: 'rust:render_page#1',
          startedAtMs: 1000,
          endedAtMs: 1050,
          durationMs: 50,
          startMemory: { rssBytes: 100, virtualBytes: 200 },
          endMemory: { rssBytes: 110, virtualBytes: 210 },
          details: { start: { page: 1 }, end: { ok: true } },
        },
        {
          id: 2,
          name: 'renderPage:page:1',
          startedAtMs: 1010,
          endedAtMs: 1070,
          durationMs: 60,
          startMemory: { rssBytes: 100, virtualBytes: 200 },
          endMemory: { rssBytes: 115, virtualBytes: 220 },
          details: { start: { page: 1 }, end: { imageBytesLength: 1024 } },
        },
      ],
    },
  });
});

afterEach(() => {
  cleanup();
  clearMocks();
  vi.unstubAllEnvs();
});

describe('ProfilerApp', () => {
  it('shows frontend and backend events by default', async () => {
    ({ default: ProfilerApp } = await import('../../src/profiling/ProfilerApp'));
    render(<ProfilerApp/>);

    expect(await screen.findByText('Session')).toBeTruthy();
    expect(await screen.findByText('rust:render_page#1')).toBeTruthy();
    expect(await screen.findByText('renderPage:page:1')).toBeTruthy();
  });

  it('backend filter is unchecked', async () => {
    const user = userEvent.setup();
    ({ default: ProfilerApp } = await import('../../src/profiling/ProfilerApp'));
    render(<ProfilerApp/>);

    const backendFilter = await screen.findByLabelText('Backend');
    await user.click(backendFilter);

    expect(screen.queryByText('rust:render_page#1')).toBeNull();
    expect(screen.getByText('renderPage:page:1')).toBeTruthy();
  });

  it('frontend filter is unchecked', async () => {
    const user = userEvent.setup();
    ({ default: ProfilerApp } = await import('../../src/profiling/ProfilerApp'));
    render(<ProfilerApp/>);

    const frontendFilter = await screen.findByLabelText('Frontend');
    await user.click(frontendFilter);

    expect(screen.getByText('rust:render_page#1')).toBeTruthy();
    expect(screen.queryByText('renderPage:page:1')).toBeNull();
  });
});
