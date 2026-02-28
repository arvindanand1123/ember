import { Controls, type ControlSpec } from '../Controls';

const primaryButtonSpec: ControlSpec = {
  variant: 'primary',
  size: 'lg',
  paddingX: 6,
  paddingY: 3,
  fontSize: 'base',
  fontWeight: 'medium',
};

export const PrimaryButton = Controls.build(primaryButtonSpec);
