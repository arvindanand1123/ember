import 'styled-components';

import { Theme } from './theme';

declare module 'styled-components' {
  // Module augmentation: DefaultTheme must inherit Theme's members without adding any.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- no members to add
  export interface DefaultTheme extends Theme {}
}
