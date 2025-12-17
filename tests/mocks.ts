import { mockIPC } from '@tauri-apps/api/mocks';

export function setupTauriMocks() {
  mockIPC((cmd) => {
    if (cmd === 'plugin:dialog|open') {
      return '/Users/test/documents/sample.pdf';
    }
  });
}
