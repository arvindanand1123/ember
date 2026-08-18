import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import App from '../../src/App';
import { clearMocks, setupTauriMocks } from '../mocks';
import { clickButton } from '../utils';

let container: HTMLElement;
let getAppMenu: ReturnType<typeof setupTauriMocks>['getAppMenu'];

beforeEach(async () => {
  ({ getAppMenu } = setupTauriMocks('../ember/tests/basic.pdf'));
  ({ container } = render(<App/>));

  // `clearMocks` deletes the IPC internals, so the async menu setup has to
  // finish before a test ends or its remaining `Menu.new` calls throw.
  await waitFor(() => assert(getAppMenu(), 'app menu was never set'));
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('App', () => {
  it('init', () => {
    assert.deepEqual(getAppMenu(), [
      {
        kind: 'Submenu',
        text: 'Ember',
        items: [{ kind: 'Predefined', text: 'Quit' }],
      },
      {
        kind: 'Submenu',
        text: 'File',
        items: [
          { kind: 'MenuItem', text: 'Save' },
          { kind: 'MenuItem', text: 'Save As' },
        ],
      },
    ]);
  });

  it('drags', () => {
    assert(screen.getAllByText('Ember').length >= 1);
    assert(container.querySelector('[data-tauri-drag-region]'));
  });

  it('file select', async () => {
    await clickButton({ text: 'Select File' });
    assert(await screen.findByText('basic.pdf'));
  });

  it('pdf view', async () => {
    await clickButton({ text: 'Select File' });
    await clickButton({ text: 'Back' });
    assert(screen.getByText('Select File'));
  });

});
