import { Controls, type ControlSpec } from '../Controls';

const iconButtonSpec: ControlSpec = {
  iconOnly: true,
  size: 'sm',
};

export const IconButton = Controls.build(iconButtonSpec);
