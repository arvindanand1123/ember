import { describe, it,  vi, beforeEach, afterEach } from 'vitest';
import { render, screen  } from '@testing-library/react';
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
  it('basic', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FileSelectorPage onFileSelected={vi.fn()}/>
      </ThemeProvider>,
    );

    const user = userEvent.setup();
    const button = screen.getByText('Select File');
    await user.click(button);
  });
});
