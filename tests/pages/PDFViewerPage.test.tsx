import { clearMocks } from '@tauri-apps/api/mocks';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it, vi } from 'vitest';

import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { setupTauriMocks } from '../mocks';

beforeEach(() => {
  setupTauriMocks();
});

afterEach(() => {
  clearMocks();
});

describe('PDFViewerPage', () => {
  it('basic', async () => {
    render(
      <ThemeProvider theme={theme}>
        <PDFViewerPage filePath="../phorgePDF/tests/basic.pdf" onBack={vi.fn()}/>
      </ThemeProvider>,
    );
    assert(await screen.findByText('Loading PDF...'));
    assert(await screen.findByText('Page 1 of 1'));

  });
});
