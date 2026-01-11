import { mockIPC } from '@tauri-apps/api/mocks';
import { readFile } from 'fs/promises';

export function setupTauriMocks(dialogFilePath: string | null = null) {

  mockIPC(async (cmd, payload) => {
    // Handle event plugin commands
    if (cmd === 'plugin:event|listen') {
      return 1; // Return a listener ID
    } else if (cmd === 'plugin:event|unlisten') {
      return null;
    }
    let filePath: string | null;
    if ( payload ){
      if ('filePath' in payload){
        filePath = payload.filePath as string;
      } else {
        filePath = null;
      }
    } else {
      filePath = null;
    }
    let file;
    if (filePath){
      file = await readFile(filePath);
    } else {
      file = null;
    }
    if (cmd === 'plugin:dialog|open') {
      return dialogFilePath;
    } else if (cmd === 'load_pdf') {
      return { page_count: 1, title: 'Title', author: null };
    } else if (cmd === 'get_page_info') {
      return { page_index: 0, width: 612, height: 792 };
    } else if (cmd === 'render_page_to_base64') {
      if (file){
        return `data:image/png;base64,${file.toString('base64')}`;
      } else {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      }
    }
  });
}
