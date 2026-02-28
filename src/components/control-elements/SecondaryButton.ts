import { Controls, type ControlSpec } from '../Controls';

const secondaryButtonSpec: ControlSpec = {
  size: 'sm',
  paddingX: 4,
  paddingY: 2,
  fontSize: 'sm',
};

export const SecondaryButton = Controls.build(secondaryButtonSpec);
