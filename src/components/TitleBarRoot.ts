import styled from 'styled-components';

export const TitleBarRoot = styled.header`
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
