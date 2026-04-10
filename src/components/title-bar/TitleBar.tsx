import { TitleBarCenter } from './TitleBarCenter';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRightSpacer } from './TitleBarRightSpacer';
import { TitleBarRoot } from './TitleBarRoot';

interface TitleBarProps {
  filePath?: string | null;
}

export function TitleBar({ filePath }: TitleBarProps) {
  const fileName = filePath ? (filePath.split(/[\\/]/).pop() || filePath) : 'Ember';

  return (
    <TitleBarRoot data-tauri-drag-region>
      <TitleBarLeft/>
      <TitleBarCenter fileName={fileName}/>
      <TitleBarRightSpacer aria-hidden="true"/>
    </TitleBarRoot>
  );
}
