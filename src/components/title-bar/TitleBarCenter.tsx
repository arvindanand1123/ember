import styled from 'styled-components';

import { Container, type ContainerSpec } from '../Container';

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

const CenterTitle = Container.build({
  position: 'absolute',
  left: '50%',
  top: '50%',
  maxWidth: '52%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
} satisfies ContainerSpec);

// agents-allow: theme-tokens -- no token matches 12.5px (xs is 12px, sm is 13px), and
// rounding to either changes the rendered title bar size. Whether that size change is
// acceptable is an unmade design decision, not a settled one.
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
