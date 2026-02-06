import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { setupTauriMocks } from '../mocks';
import { noop } from '../utils';

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
    const zoomInButton = await screen.findByLabelText('Zoom in');
    fireEvent.click(zoomInButton);
    assert(await screen.findByText('125%'));
  });
});
