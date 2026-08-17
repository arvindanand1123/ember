import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it, vi } from 'vitest';

import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { clearMocks, setupTauriMocks } from '../mocks';
import { clickButton, noop } from '../utils';

let revokeObjectURLMock: ReturnType<typeof setupTauriMocks>['revokeObjectURLMock'];

beforeEach(() => {
  ({  revokeObjectURLMock } = setupTauriMocks());
  render(
    <ThemeProvider theme={theme}>
      <PDFViewerPage
        filePath="../ember/tests/basic.pdf"
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
});
