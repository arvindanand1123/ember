import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it, vi } from 'vitest';

import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { setupTauriMocks } from '../mocks';
import { clickButton, noop } from '../utils';

let createObjectURLMock: ReturnType<typeof vi.fn>;
let revokeObjectURLMock: ReturnType<typeof vi.fn>;
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeEach(() => {
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

  setupTauriMocks();
  render(
    <ThemeProvider theme={theme}>
      <PDFViewerPage filePath="../ember/tests/basic.pdf" onBack={noop}/>
    </ThemeProvider>,
  );
});

afterEach(() => {
  cleanup();
  clearMocks();
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
});

describe('PDFViewerPage', () => {
  it('basic', async () => {
    assert(await screen.findByText('Loading document...'));
    assert(await screen.findByText('Page 1 of 1'));
  });

  it('document', async () => {
    const image = await screen.findByAltText('Page 1');
    assert(image);
    assert(image.tagName === 'IMG');
    assert(image.getAttribute('src') === 'blob:render-1');
    assert(createObjectURLMock.mock.calls.length === 1);

    const [blob] = createObjectURLMock.mock.calls[0];
    assert(blob instanceof Blob);
    assert(blob.type === 'image/png');
    assert(blob.size > 0);
  });

  it('revokes object urls when rerendering and unmounting', async () => {
    await screen.findByAltText('Page 1');
    assert(revokeObjectURLMock.mock.calls.length === 0);

    await clickButton({ label: 'Zoom in' });

    await waitFor(() => {
      assert(createObjectURLMock.mock.calls.length === 2);
      assert(revokeObjectURLMock.mock.calls.length === 1);
    });
    assert(revokeObjectURLMock.mock.calls[0][0] === 'blob:render-1');

    cleanup();
    assert(revokeObjectURLMock.mock.calls.length === 2);
    assert(revokeObjectURLMock.mock.calls[1][0] === 'blob:render-2');
  });

  it('zoom', async () => {
    await clickButton({ label: 'Zoom in' });
    assert(await screen.findByText('125%'));

    await clickButton({ label: 'Zoom out' });
    assert(await screen.findByText('100%'));
  });

  it('title bar', async () => {
    assert(await screen.findByText('Ember'));
    assert(await screen.findByText('basic.pdf'));
  });
});
