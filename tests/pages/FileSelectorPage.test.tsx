import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { theme } from '../../src/components/theme';
import FileSelectorPage from '../../src/pages/FileSelectorPage';
import { clearMocks, setupTauriMocks } from '../mocks';
import { clickButton, noop } from '../utils';

beforeEach(() => {
  setupTauriMocks();
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('FileSelectorPage', () => {
  it('inits', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FileSelectorPage onFileSelected={noop}/>
      </ThemeProvider>,
    );
    await clickButton({ text: 'Select File' });
  });
});
