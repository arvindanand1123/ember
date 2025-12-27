import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function clickButton(buttonName) {
  const user = userEvent.setup();
  const button = screen.getByText(buttonName);
  await user.click(button);
}
