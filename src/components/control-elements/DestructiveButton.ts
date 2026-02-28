import { Controls, type ControlSpec } from '../Controls';

const destructiveButtonSpec: ControlSpec = {
  variant: 'destructive',
};

export const DestructiveButton = Controls.build(destructiveButtonSpec);
