import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const noop = () => {};

type ClickButtonOptions =
  | { text: string; label?: never }
  | { text?: never; label: string };

export async function clickButton(options: ClickButtonOptions) {
  const text  = options.text;
  const label  = options.label;
  if ( text ){
    const user = userEvent.setup();
    const button =  screen.getByText(text);
    await user.click(button);
  } else if (label){
    const button = await screen.findByLabelText(label);
    fireEvent.click(button);
  }

}
