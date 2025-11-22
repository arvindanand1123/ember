import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleKeyDown } from '../hooks/useHandleKeyDown';

const CommandInputContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.space[5]};
  right: ${({ theme }) => theme.space[5]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[2]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 300px;
  z-index: 1000;
`;

const CommandPrompt = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

export default function CommandInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { handleKeyDown, showCommandInput, commandText } = useHandleKeyDown({ inputRef });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandInput, handleKeyDown]);

  return (
    showCommandInput ? (
      <CommandInputContainer>
        <CommandPrompt>:</CommandPrompt>
        <StyledInput
          ref={inputRef}
          type="text"
          value={commandText}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
        />
      </CommandInputContainer>
    ) : ( <></> )
  );
}
