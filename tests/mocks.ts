import { mockIPC } from '@tauri-apps/api/mocks';

export function setupTauriMocks() {
  mockIPC((cmd) => {
    if (cmd === 'plugin:dialog|open') {
      return '/Users/test/documents/sample.pdf';
    }
    if (cmd === 'load_pdf') {
      return { page_count: 1, title: 'Test PDF' };
    }
    if (cmd === 'render_page_to_base64') {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  });
}
