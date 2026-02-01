import styled from 'styled-components';

export const CommandInputField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  height: auto;
  padding: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus-visible {
    box-shadow: none;
  }
`;
