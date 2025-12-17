import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { clearMocks } from '@tauri-apps/api/mocks';
import FileSelectorPage from '../../src/pages/FileSelectorPage';
import { theme } from '../../src/components/theme';
import { setupTauriMocks } from '../mocks';

beforeEach(() => {
  setupTauriMocks();
});

afterEach(() => {
  clearMocks();
});

describe('FileSelectorPage', () => {
  it('calls onFileSelected with the selected PDF path', async () => {
    const onFileSelected = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <FileSelectorPage onFileSelected={onFileSelected}/>
      </ThemeProvider>,
    );

    const user = userEvent.setup();
    const button = screen.getByText('Select File');
    await user.click(button);

    await waitFor(() => {
      expect(onFileSelected).toHaveBeenCalledWith('/Users/test/documents/sample.pdf');
    });
  });
});
