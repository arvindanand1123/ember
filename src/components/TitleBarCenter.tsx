import styled from 'styled-components';

interface TitleBarCenterProps {
  fileName: string;
}

export function TitleBarCenter({ fileName }: TitleBarCenterProps) {
  return (
    <CenterTitle>
      <FileName title={fileName}>{fileName}</FileName>
    </CenterTitle>
  );
}

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
