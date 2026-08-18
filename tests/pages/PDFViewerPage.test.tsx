import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it, vi } from 'vitest';

import { APP_MENU_SAVE_AS_EVENT, APP_MENU_SAVE_EVENT } from '../../src/appMenu';
import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { clearMocks, setupTauriMocks } from '../mocks';
import { clickButton, noop } from '../utils';

const FILE_PATH = '../ember/tests/basic.pdf';
const SAVE_AS_PATH = '../ember/tests/copy.pdf';

let revokeObjectURLMock: ReturnType<typeof setupTauriMocks>['revokeObjectURLMock'];

async function dispatchAppMenuEvent(eventName: string) {
  await act(async () => {
    window.dispatchEvent(new Event(eventName));
  });
}

beforeEach(() => {
  ({  revokeObjectURLMock } = setupTauriMocks(null, SAVE_AS_PATH));
  render(
    <ThemeProvider theme={theme}>
      <PDFViewerPage
        filePath={FILE_PATH}
        onBack={noop}
        onFilePathChange={vi.fn()}
      />
    </ThemeProvider>,
  );
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('PDFViewerPage', () => {
  it('inits', async () => {
    assert(await screen.findByText('Loading document...'));
    assert(await screen.findByText('Page 1 of 1'));
  });

  it('renders', async () => {
    const image = await screen.findByAltText('Page 1');
    assert(image.getAttribute('src') === 'blob:render-1');
  });

  it('rerenders', async () => {
    await screen.findByAltText('Page 1');
    await clickButton({ label: 'Zoom in' });

    await waitFor(() => {
      assert(revokeObjectURLMock.mock.calls[0][0] === 'blob:render-1');
    });

    cleanup();
    assert(revokeObjectURLMock.mock.calls[1][0] === 'blob:render-2');
  });

  it('zooms', async () => {
    await clickButton({ label: 'Zoom in' });
    assert(await screen.findByText('125%'));

    await clickButton({ label: 'Zoom out' });
    assert(await screen.findByText('100%'));
  });

  it('rotates', async () => {
    const pageImage = await screen.findByAltText('Page 1');
    const pageFrame = pageImage.parentElement;
    assert(pageFrame);
    assert(pageFrame.getAttribute('data-rotation') === '0');

    await clickButton({ label: 'Rotate document' });
    assert(pageFrame.getAttribute('data-rotation') === '90');

    await clickButton({ label: 'Rotate document' });
    assert(pageFrame.getAttribute('data-rotation') === '180');
  });

  it('saves', async () => {
    await dispatchAppMenuEvent(APP_MENU_SAVE_EVENT);
    assert(await screen.findByText('Saved basic.pdf'));
  });

  it('saves as', async () => {
    await dispatchAppMenuEvent(APP_MENU_SAVE_AS_EVENT);
    assert(await screen.findByText('Saved as copy.pdf'));
  });
});
