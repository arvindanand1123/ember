import { TitleBarCenter } from './TitleBarCenter';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRightSpacer } from './TitleBarRightSpacer';
import { TitleBarRoot } from './TitleBarRoot';

interface TitleBarProps {
  filePath: string;
}

export function TitleBar({ filePath }: TitleBarProps) {
  const fileName = filePath.split(/[\\/]/).pop() || filePath;

  return (
    <TitleBarRoot data-tauri-drag-region>
      <TitleBarLeft/>
      <TitleBarCenter fileName={fileName}/>
      <TitleBarRightSpacer aria-hidden="true"/>
    </TitleBarRoot>
  );
}
