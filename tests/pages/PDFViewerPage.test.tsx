import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it, vi } from 'vitest';

import { APP_MENU_SAVE_AS_EVENT, APP_MENU_SAVE_EVENT } from '../../src/appMenu';
import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { clearMocks, setupTauriMocks } from '../mocks';
import { clickButton, noop } from '../utils';

let revokeObjectURLMock: ReturnType<typeof setupTauriMocks>['revokeObjectURLMock'];
let savePdfMock: ReturnType<typeof setupTauriMocks>['savePdfMock'];
let onFilePathChange: ReturnType<typeof vi.fn>;

beforeEach(() => {
  ({ revokeObjectURLMock, savePdfMock } = setupTauriMocks(
    null,
    '/tmp/ember-saved-copy.pdf',
  ));
  onFilePathChange = vi.fn();
  render(
    <ThemeProvider theme={theme}>
      <PDFViewerPage
        filePath="../ember/tests/basic.pdf"
        onBack={noop}
        onFilePathChange={onFilePathChange}
      />
    </ThemeProvider>,
  );
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('PDFViewerPage', () => {
  it('basic', async () => {
    assert(await screen.findByText('Loading document...'));
    assert(await screen.findByText('Page 1 of 1'));
  });

  it('document', async () => {
    const image = await screen.findByAltText('Page 1');
    assert(image.getAttribute('src') === 'blob:render-1');
  });

  it('revokes object urls when rerendering and unmounting', async () => {
    await screen.findByAltText('Page 1');
    await clickButton({ label: 'Zoom in' });

    await waitFor(() => {
      assert(revokeObjectURLMock.mock.calls[0][0] === 'blob:render-1');
    });

    cleanup();
    assert(revokeObjectURLMock.mock.calls[1][0] === 'blob:render-2');
  });

  it('zoom', async () => {
    await clickButton({ label: 'Zoom in' });
    assert(await screen.findByText('125%'));

    await clickButton({ label: 'Zoom out' });
    assert(await screen.findByText('100%'));
  });

  it('rotation control', async () => {
    const pageImage = await screen.findByAltText('Page 1');
    const pageFrame = pageImage.parentElement;
    assert(pageFrame);
    assert(pageFrame.getAttribute('data-rotation') === '0');

    await clickButton({ label: 'Rotate document' });
    assert(pageFrame.getAttribute('data-rotation') === '90');

    await clickButton({ label: 'Rotate document' });
    assert(pageFrame.getAttribute('data-rotation') === '180');
  });

  it('save calls the tauri save endpoint for the active file', async () => {
    window.dispatchEvent(new Event(APP_MENU_SAVE_EVENT));

    await screen.findByText('Saved basic.pdf');
    assert(savePdfMock.mock.calls[0][0] === '../ember/tests/basic.pdf');
    assert(savePdfMock.mock.calls[0][1] === '../ember/tests/basic.pdf');
  });

  it('save as saves to a new pdf path and updates the active file path', async () => {
    window.dispatchEvent(new Event(APP_MENU_SAVE_AS_EVENT));

    await screen.findByText('Saved as ember-saved-copy.pdf');
    assert(savePdfMock.mock.calls[0][0] === '../ember/tests/basic.pdf');
    assert(savePdfMock.mock.calls[0][1] === '/tmp/ember-saved-copy.pdf');
    assert(onFilePathChange.mock.calls[0][0] === '/tmp/ember-saved-copy.pdf');
  });
});
