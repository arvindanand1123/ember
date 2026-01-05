import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { theme } from '../../src/components/theme';
import FileSelectorPage from '../../src/pages/FileSelectorPage';
import { setupTauriMocks } from '../mocks';
import { clickButton } from '../utils';

beforeEach(() => {
  setupTauriMocks();
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('FileSelectorPage', () => {
  it('basic', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FileSelectorPage onFileSelected={() => {}}/>
      </ThemeProvider>,
    );
    await clickButton('Select File');
  });
});
