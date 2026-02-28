import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

import type { Theme } from './theme';

export type ContainerStackType = 'row' | 'col' | null;

type SpaceToken = keyof Theme['space'];
type RadiusToken = keyof Theme['radii'];
type ShadowToken = keyof Theme['shadows'];
type ZIndexToken = keyof Theme['zIndex'];

type DimensionValue = number | string;
type TokenOrRawValue<TToken extends string | number | symbol> = TToken | number | string;

export interface ContainerSpec {
  stackType?: ContainerStackType;
  position?: CSSProperties['position'];
  top?: TokenOrRawValue<SpaceToken>;
  right?: TokenOrRawValue<SpaceToken>;
  bottom?: TokenOrRawValue<SpaceToken>;
  left?: TokenOrRawValue<SpaceToken>;
  width?: DimensionValue;
  height?: DimensionValue;
  minWidth?: DimensionValue;
  maxWidth?: DimensionValue;
  minHeight?: DimensionValue;
  maxHeight?: DimensionValue;
  gap?: TokenOrRawValue<SpaceToken>;
  padding?: TokenOrRawValue<SpaceToken>;
  paddingX?: TokenOrRawValue<SpaceToken>;
  paddingY?: TokenOrRawValue<SpaceToken>;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  surface?: 'none' | 'bg' | 'surface' | 'surfaceElevated';
  border?: 'none' | 'default' | 'top' | 'bottom';
  radius?: TokenOrRawValue<RadiusToken>;
  shadow?: 'none' | ShadowToken;
  zIndex?: TokenOrRawValue<ZIndexToken>;
  overflow?: CSSProperties['overflow'];
}

interface ContainerProps {
  spec?: ContainerSpec;
  stackType?: ContainerStackType;
}

const NON_FORWARD_PROPS = new Set<string>(['spec', 'stackType']);

function toCssSize(value?: DimensionValue): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function toInset(theme: Theme, value?: TokenOrRawValue<SpaceToken>): string | undefined {
  return toSpace(theme, value);
}

function toSpace(theme: Theme, value?: TokenOrRawValue<SpaceToken>): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return value in theme.space ? theme.space[value as SpaceToken] : `${value}px`;
  }
  if (Object.prototype.hasOwnProperty.call(theme.space, value)) {
    return theme.space[value as unknown as SpaceToken];
  }
  return value;
}

function toRadius(theme: Theme, value?: TokenOrRawValue<RadiusToken>): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (Object.prototype.hasOwnProperty.call(theme.radii, value)) {
    return theme.radii[value as RadiusToken];
  }
  return value;
}

function toZIndex(theme: Theme, value?: TokenOrRawValue<ZIndexToken>): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return String(value);
  }
  if (Object.prototype.hasOwnProperty.call(theme.zIndex, value)) {
    return String(theme.zIndex[value as ZIndexToken]);
  }
  return value;
}

function resolveSurface(theme: Theme, surface?: ContainerSpec['surface']) {
  switch (surface) {
    case 'bg':
      return theme.colors.bg;
    case 'surface':
      return theme.colors.surface;
    case 'surfaceElevated':
      return theme.colors.surfaceElevated;
    default:
      return undefined;
  }
}

function resolveShadow(theme: Theme, shadow?: ContainerSpec['shadow']) {
  if (!shadow || shadow === 'none') return undefined;
  return theme.shadows[shadow];
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !NON_FORWARD_PROPS.has(String(prop)),
})<ContainerProps>`
  ${({ theme, spec, stackType }) => {
    const resolvedStackType = stackType ?? spec?.stackType ?? null;
    const surface = resolveSurface(theme, spec?.surface);
    const shadow = resolveShadow(theme, spec?.shadow);
    const radius = toRadius(theme, spec?.radius);
    const gap = toSpace(theme, spec?.gap);
    const padding = toSpace(theme, spec?.padding);
    const paddingX = toSpace(theme, spec?.paddingX);
    const paddingY = toSpace(theme, spec?.paddingY);
    const zIndex = toZIndex(theme, spec?.zIndex);

    return css`
      ${resolvedStackType
    ? css`
            display: flex;
            flex-direction: ${resolvedStackType === 'row' ? 'row' : 'column'};
          `
    : css`
            display: block;
          `}

      ${spec?.position ? `position: ${spec.position};` : ''}
      ${toInset(theme, spec?.top) ? `top: ${toInset(theme, spec?.top)};` : ''}
      ${toInset(theme, spec?.right) ? `right: ${toInset(theme, spec?.right)};` : ''}
      ${toInset(theme, spec?.bottom) ? `bottom: ${toInset(theme, spec?.bottom)};` : ''}
      ${toInset(theme, spec?.left) ? `left: ${toInset(theme, spec?.left)};` : ''}

      ${toCssSize(spec?.width) ? `width: ${toCssSize(spec?.width)};` : ''}
      ${toCssSize(spec?.height) ? `height: ${toCssSize(spec?.height)};` : ''}
      ${toCssSize(spec?.minWidth) ? `min-width: ${toCssSize(spec?.minWidth)};` : ''}
      ${toCssSize(spec?.maxWidth) ? `max-width: ${toCssSize(spec?.maxWidth)};` : ''}
      ${toCssSize(spec?.minHeight) ? `min-height: ${toCssSize(spec?.minHeight)};` : ''}
      ${toCssSize(spec?.maxHeight) ? `max-height: ${toCssSize(spec?.maxHeight)};` : ''}

      ${spec?.align ? `align-items: ${spec.align};` : ''}
      ${spec?.justify ? `justify-content: ${spec.justify};` : ''}
      ${gap ? `gap: ${gap};` : ''}
      ${padding ? `padding: ${padding};` : ''}
      ${paddingX ? `padding-left: ${paddingX}; padding-right: ${paddingX};` : ''}
      ${paddingY ? `padding-top: ${paddingY}; padding-bottom: ${paddingY};` : ''}

      ${surface ? `background: ${surface};` : ''}
      ${radius ? `border-radius: ${radius};` : ''}
      ${shadow ? `box-shadow: ${shadow};` : ''}
      ${zIndex ? `z-index: ${zIndex};` : ''}
      ${spec?.overflow ? `overflow: ${spec.overflow};` : ''}

      ${spec?.border === 'default' ? `border: 1px solid ${theme.colors.border};` : ''}
      ${spec?.border === 'top' ? `border-top: 1px solid ${theme.colors.border};` : ''}
      ${spec?.border === 'bottom' ? `border-bottom: 1px solid ${theme.colors.border};` : ''}
    `;
  }}
`;
