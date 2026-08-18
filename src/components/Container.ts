import { type ComponentPropsWithoutRef, createElement, type CSSProperties } from 'react';
import styled, { css } from 'styled-components';

import { type DimensionValue, FontSizeToken, type RadiusToken, type SpaceToken, type Theme, toCssSize, type TokenOrRawValue, toRadius, toSpace } from './theme';

export type ContainerStackType = 'row' | 'col' | null;

type ShadowToken = keyof Theme['shadows'];
type ZIndexToken = keyof Theme['zIndex'];

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
  fontSize?: TokenOrRawValue<FontSizeToken>
}

interface ContainerProps {
  spec?: ContainerSpec;
}

type ContainerInjectSpec<Props, Spec extends ContainerSpec> = {
  [K in keyof Spec]?: (props: Props) => Spec[K] | undefined;
};

const NON_FORWARD_PROPS = new Set<string>(['spec']);

function toInset(theme: Theme, value?: TokenOrRawValue<SpaceToken>): string | undefined {
  return toSpace(theme, value);
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

function resolveInjectedSpec<Props, Spec extends ContainerSpec>(
  staticSpec: Spec,
  injectSpec: ContainerInjectSpec<Props, Spec>,
  props: Props,
): ContainerSpec {
  const runtimeSpec = {} as Partial<Spec>;

  (Object.keys(injectSpec) as Array<keyof Spec>).forEach((key) => {
    const resolver = injectSpec[key];
    if (!resolver) {
      return;
    }

    const value = resolver(props);
    if (value !== undefined) {
      runtimeSpec[key] = value;
    }
  });

  return {
    ...staticSpec,
    ...runtimeSpec,
  };
}

const ContainerBase = styled.div.withConfig({
  shouldForwardProp: (prop) => !NON_FORWARD_PROPS.has(String(prop)),
})<ContainerProps>`
  ${({ theme, spec }) => {
    const resolvedStackType = spec?.stackType ?? null;
    const surface = resolveSurface(theme, spec?.surface);
    const shadow = resolveShadow(theme, spec?.shadow);
    const radius = toRadius(theme, spec?.radius);
    const gap = toSpace(theme, spec?.gap);
    const padding = toSpace(theme, spec?.padding);
    const paddingX = toSpace(theme, spec?.paddingX);
    const paddingY = toSpace(theme, spec?.paddingY);
    const zIndex = toZIndex(theme, spec?.zIndex);
    const resolvedWidth = toCssSize(spec?.width);
    const resolvedHeight = toCssSize(spec?.height);
    const resolvedMinWidth = toCssSize(spec?.minWidth);
    const resolvedMaxWidth = toCssSize(spec?.maxWidth);
    const resolvedMinHeight = toCssSize(spec?.minHeight);
    const resolvedMaxHeight = toCssSize(spec?.maxHeight);

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

      ${resolvedWidth ? `width: ${resolvedWidth};` : ''}
      ${resolvedHeight ? `height: ${resolvedHeight};` : ''}
      ${resolvedMinWidth ? `min-width: ${resolvedMinWidth};` : ''}
      ${resolvedMaxWidth ? `max-width: ${resolvedMaxWidth};` : ''}
      ${resolvedMinHeight ? `min-height: ${resolvedMinHeight};` : ''}
      ${resolvedMaxHeight ? `max-height: ${resolvedMaxHeight};` : ''}

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

function buildContainer<Spec extends ContainerSpec>(spec: Spec) {
  const built = styled(ContainerBase).attrs<ContainerProps>({ spec })``;

  const inject = <Props extends object>(injectSpec: ContainerInjectSpec<Props, Spec>) => {
    type InjectedContainerProps = Props & ComponentPropsWithoutRef<typeof ContainerBase>;

    const InjectedContainer = (props: InjectedContainerProps) =>
      createElement(ContainerBase, {
        ...props,
        spec: resolveInjectedSpec(spec, injectSpec, props),
      });

    return styled(InjectedContainer)``;
  };

  return Object.assign(built, {
    inject,
  });
}

export const Container = Object.assign(ContainerBase, {
  build: buildContainer,
});
