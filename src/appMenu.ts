import { Menu, MenuItem, PredefinedMenuItem, Submenu } from '@tauri-apps/api/menu';

export const APP_MENU_SAVE_EVENT = 'ember:file-save';
export const APP_MENU_SAVE_AS_EVENT = 'ember:file-save-as';

function dispatchAppMenuEvent(eventName: string) {
  window.dispatchEvent(new Event(eventName));
}

function canUseNativeMenu() {
  if (import.meta.env.MODE === 'test') {
    return false;
  }

  const tauriInternals = (window as Window & {
    __TAURI_INTERNALS__?: { transformCallback?: unknown };
  }).__TAURI_INTERNALS__;

  return typeof tauriInternals?.transformCallback === 'function';
}

export interface AppMenuHandle {
  dispose: () => Promise<void>;
  setDocumentActionsEnabled: (enabled: boolean) => Promise<void>;
}

export async function setupAppMenu(): Promise<AppMenuHandle> {
  if (!canUseNativeMenu()) {
    return {
      dispose: async () => {},
      setDocumentActionsEnabled: async () => {},
    };
  }

  const saveItem = await MenuItem.new({
    id: 'file-save',
    text: 'Save',
    enabled: false,
    accelerator: 'CmdOrCtrl+S',
    action: () => dispatchAppMenuEvent(APP_MENU_SAVE_EVENT),
  });
  const saveAsItem = await MenuItem.new({
    id: 'file-save-as',
    text: 'Save As',
    enabled: false,
    accelerator: 'CmdOrCtrl+Shift+S',
    action: () => dispatchAppMenuEvent(APP_MENU_SAVE_AS_EVENT),
  });
  const quitItem = await PredefinedMenuItem.new({ item: 'Quit' });
  const emberMenu = await Submenu.new({
    text: 'Ember',
    items: [quitItem],
  });
  const fileMenu = await Submenu.new({
    text: 'File',
    items: [saveItem, saveAsItem],
  });
  const menu = await Menu.new({
    items: [emberMenu, fileMenu],
  });

  await menu.setAsAppMenu();

  return {
    dispose: async () => {
      await Promise.all([
        menu.close(),
        emberMenu.close(),
        fileMenu.close(),
        saveItem.close(),
        saveAsItem.close(),
        quitItem.close(),
      ]);
    },
    setDocumentActionsEnabled: async (enabled: boolean) => {
      await Promise.all([
        saveItem.setEnabled(enabled),
        saveAsItem.setEnabled(enabled),
      ]);
    },
  };
}
