import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import App from '../../src/App';
import { setupTauriMocks } from '../mocks';
import { clickButton } from '../utils';

beforeEach(() => {
  setupTauriMocks('../ember/tests/basic.pdf');
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('App', () => {
  it('file select', async () => {
    render(<App/>);
    assert(screen.getByText('Select File'));
    await clickButton({ text: 'Select File' });
  });

  it('pdf view', async () => {
    render(<App/>);
    await clickButton({ text: 'Select File' });
    await clickButton({ text: 'Back' });
    assert(screen.getByText('Select File'));
  });
});
