import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import { theme } from '../../src/components/theme';
import PDFViewerPage from '../../src/pages/PDFViewerPage';
import { setupTauriMocks } from '../mocks';

beforeEach(() => {
  setupTauriMocks();
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('PDFViewerPage', () => {
  it('basic', async () => {
    render(
      <ThemeProvider theme={theme}>
        <PDFViewerPage filePath="../phorgePDF/tests/basic.pdf" onBack={() => {}}/>
      </ThemeProvider>,
    );
    assert(await screen.findByText('Loading PDF...'));
    assert(await screen.findByText('Page 1 of 1'));
  });
});
