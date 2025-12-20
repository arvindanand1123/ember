import { clearMocks } from '@tauri-apps/api/mocks';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
    const mockOnBack = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <PDFViewerPage filePath="/test/path.pdf" onBack={mockOnBack}/>
      </ThemeProvider>,
    );

    expect(await screen.findByText('Loading PDF...')).toBeTruthy();
  });
});
