import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import App from '../../src/App';
import { clearMocks, setupTauriMocks } from '../mocks';
import { clickButton } from '../utils';

beforeEach(() => {
  setupTauriMocks({ dialogFilePath: '../ember/tests/basic.pdf' });
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('App', () => {
  it('drags', () => {
    const { container } = render(<App/>);

    assert(screen.getAllByText('Ember').length >= 1);
    assert(container.querySelector('[data-tauri-drag-region]'));
  });

  it('file select', async () => {
    render(<App/>);
    assert(screen.getByText('Select File'));
    await clickButton({ text: 'Select File' });
    assert(await screen.findByText('basic.pdf'));
  });

  it('pdf view', async () => {
    render(<App/>);
    await clickButton({ text: 'Select File' });
    await clickButton({ text: 'Back' });
    assert(screen.getByText('Select File'));
  });
});
