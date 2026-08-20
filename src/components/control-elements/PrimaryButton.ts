import { Controls, type ControlSpec } from '../Controls';

export const PrimaryButton = Controls.build({
  variant: 'primary',
  size: 'lg',
  paddingX: 6,
  paddingY: 3,
  fontSize: 'base',
  fontWeight: 'medium',
} satisfies ControlSpec);
