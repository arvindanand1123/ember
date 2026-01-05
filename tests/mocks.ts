import { mockIPC } from '@tauri-apps/api/mocks';
import { readFile } from 'fs/promises';

export function setupTauriMocks(dialogFilePath: string | null = null) {

  mockIPC(async (cmd, payload) => {
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
      return { page_count: 1, title: 'Title' };
    } else if (cmd === 'render_page_to_base64') {
      if (file){
        return `data:image/png;base64,${file.toString('base64')}`;
      } else {
        return null;
      }
    }
  });
}
