import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

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

  const [showCommandInput, setShowCommandInput] = useState<boolean>(false);
  const [commandText, setCommandText] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ':' && !showCommandInput) {
        e.preventDefault();
        setShowCommandInput(true);
        setCommandText('');
      }

      if ( showCommandInput ){
        inputRef.current?.focus();
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandInput]);

  const handleCommandSubmit = (command: string) => {
    console.log('Command entered:', command);
    setShowCommandInput(false);
    setCommandText('');
  };

  const handleCommandClose = () => {
    setShowCommandInput(false);
    setCommandText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSubmit(commandText);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCommandClose();
    }
  };

  return (
    <CommandInputContainer>
      <CommandPrompt>:</CommandPrompt>
      <StyledInput
        ref={inputRef}
        type="text"
        value={commandText}
        onChange={(e) => setCommandText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter command..."
      />
    </CommandInputContainer>
  );
}
