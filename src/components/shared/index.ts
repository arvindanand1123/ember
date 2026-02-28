import type { Theme } from '../theme';

export type SpaceToken = keyof Theme['space'];
export type RadiusToken = keyof Theme['radii'];

export type DimensionValue = number | string;
export type TokenOrRawValue<TToken extends string | number | symbol> = TToken | number | string;

export function toCssSize(value?: DimensionValue): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export function toSpace(theme: Theme, value?: TokenOrRawValue<SpaceToken>): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return value in theme.space ? theme.space[value as SpaceToken] : `${value}px`;
  }
  if (Object.prototype.hasOwnProperty.call(theme.space, value)) {
    return theme.space[value as unknown as SpaceToken];
  }
  return value;
}

export function toRadius(theme: Theme, value?: TokenOrRawValue<RadiusToken>): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (Object.prototype.hasOwnProperty.call(theme.radii, value)) {
    return theme.radii[value as RadiusToken];
  }
  return value;
}
