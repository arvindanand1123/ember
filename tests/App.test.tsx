import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import App from '../src/App';
import { clearMocks, setupTauriMocks } from './mocks';
import { clickButton } from './utils';

let container: HTMLElement;
let getAppMenu: ReturnType<typeof setupTauriMocks>['getAppMenu'];

beforeEach(async () => {
  ({ getAppMenu } = setupTauriMocks('../ember/tests/basic.pdf'));
  ({ container } = render(<App/>));
  await waitFor(() => assert(getAppMenu()));
});

afterEach(() => {
  cleanup();
  clearMocks();
});

describe('App', () => {
  it('inits', () => {
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

  it('file selects', async () => {
    await clickButton({ text: 'Select File' });
    assert(await screen.findByText('basic.pdf'));
  });

  it('pdf views', async () => {
    await clickButton({ text: 'Select File' });
    await clickButton({ text: 'Back' });
    assert(screen.getByText('Select File'));
  });

});
