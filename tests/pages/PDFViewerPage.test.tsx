import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { setupTauriMocks } from '../mocks';
import { clickButton, noop } from '../utils';

beforeEach(() => {
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
  });

  it('zoom', async () => {
    await clickButton({ label: 'Zoom in' });
    assert(await screen.findByText('125%'));

    await clickButton({ label: 'Zoom out' });
    assert(await screen.findByText('100%'));
  });

  it('rotation control', async () => {
    const pageImage = await screen.findByAltText('Page 1');
    const pageFrame = pageImage.closest('.pdf-page-frame');
    assert(pageFrame);
    assert(pageFrame.getAttribute('data-rotation') === '0');

    await clickButton({ label: 'Rotate document' });
    assert(pageFrame.getAttribute('data-rotation') === '90');

    await clickButton({ label: 'Rotate document' });
    assert(pageFrame.getAttribute('data-rotation') === '180');
  });

  it('title bar', async () => {
    assert(await screen.findByText('Ember'));
    assert(await screen.findByText('basic.pdf'));
  });
});
