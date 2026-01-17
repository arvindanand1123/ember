import React, { useEffect, useRef } from 'react';

import { useHandleKeyDown } from '../hooks/useHandleKeyDown';
import { CommandInputContainer, CommandInputField, CommandPrompt } from './styles';

export default function CommandInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { handleKeyDown, showCommandInput, commandText, handleOnChange } = useHandleKeyDown({ inputRef });

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>);
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [showCommandInput, handleKeyDown]);

  if (!showCommandInput) return null;

  return (
    <CommandInputContainer>
      <CommandPrompt>:</CommandPrompt>
      <CommandInputField
        ref={inputRef}
        type="text"
        value={commandText}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter command..."
      />
    </CommandInputContainer>
  );
}
