import flameGlyph from '../assets/ember-flame.svg';

import styled from 'styled-components';

interface TitleBarProps {
  filePath: string;
}

export function TitleBar({ filePath }: TitleBarProps) {
  const fileName = filePath.split(/[\\/]/).pop() || filePath;

  return (
    <TitleBarRoot data-tauri-drag-region>
      <LeftCluster>
        <NativeControlsSpacer aria-hidden="true"/>
        <Divider aria-hidden="true"/>
        <AppHeader data-nodrag>
          <AppMark alt="" src={flameGlyph} aria-hidden="true"/>
          <AppName>Ember</AppName>
        </AppHeader>
      </LeftCluster>

      <CenterTitle>
        <FileName title={fileName}>{fileName}</FileName>
      </CenterTitle>

      <RightSpacer aria-hidden="true"/>
    </TitleBarRoot>
  );
}

const TitleBarRoot = styled.header`
  height: 38px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background:
    linear-gradient(180deg, rgba(255, 159, 28, 0.08), rgba(255, 159, 28, 0)),
    ${({ theme }) => theme.colors.surface};
  -webkit-app-region: drag;
`;

const LeftCluster = styled.div`
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const NativeControlsSpacer = styled.div`
  width: 72px;
  height: 12px;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.colors.border};
`;

const AppHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  -webkit-app-region: no-drag;
`;

const AppMark = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const AppName = styled.span`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const CenterTitle = styled.div`
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 52%;
`;

const FileName = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

const RightSpacer = styled.div`
  min-width: 280px;
`;
