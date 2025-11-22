import React, { useState } from 'react';

export function useHandleKeyDown({ inputRef }: { inputRef:React.RefObject<HTMLInputElement| null > }) {

  const [showCommandInput, setShowCommandInput] = useState<boolean>(false);
  const [commandText, setCommandText] = useState<string>('');

  const handleCommandClose = () => {
    setShowCommandInput(false);
    setCommandText('');
  };

  const handleCommandSubmit = (command: string) => {
    console.log('Command entered:', command);
    handleCommandClose();
  };

  const handleOnChange = (e:React.ChangeEventHandler<HTMLInputElement> | undefined) => {
    if (e){
      setCommandText(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ':' && !showCommandInput) {
      e.preventDefault();
      setShowCommandInput(true);
      setCommandText('');
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCommandSubmit(commandText);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCommandClose();
      }
    }
    if ( showCommandInput ){
      if (inputRef){
        inputRef.current?.focus();
      }
    }

  };

  return { handleKeyDown, showCommandInput, commandText, handleOnChange };

};
