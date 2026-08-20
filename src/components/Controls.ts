import * as RadixIcons from '@radix-ui/react-icons';
import { type ComponentType, createElement, type CSSProperties, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { type ColorTokenOrRawValue, type DimensionValue, FontSizeToken, type RadiusToken, resolveColor, type SpaceToken, type Theme, toCssSize, type TokenOrRawValue, toRadius, toSpace } from './theme';

type ControlSizeToken = keyof Theme['controlSizes'];
type IconSizeToken = keyof Theme['iconSizes'];
type FontWeightToken = keyof Theme['fontWeights'];
type ShadowToken = keyof Theme['shadows'];
type RadixIconExportName = Extract<keyof typeof RadixIcons, `${string}Icon`>;
type RadixIconBaseName = RadixIconExportName extends `${infer TBase}Icon` ? TBase : never;

export type ControlVariant = 'default' | 'primary' | 'destructive';
export type ControlBorder = 'default' | 'none' | 'transparent';
export type ControlIconName = Uncapitalize<RadixIconBaseName> | RadixIconExportName;

export interface ControlSpec {
  variant?: ControlVariant;
  icon?: ControlIconName;
  iconOnly?: boolean;
  size?: ControlSizeToken;
  iconSize?: IconSizeToken;
  width?: DimensionValue;
  minWidth?: DimensionValue;
  maxWidth?: DimensionValue;
  height?: DimensionValue;
  minHeight?: DimensionValue;
  maxHeight?: DimensionValue;
  gap?: TokenOrRawValue<SpaceToken>;
  padding?: TokenOrRawValue<SpaceToken>;
  paddingX?: TokenOrRawValue<SpaceToken>;
  paddingY?: TokenOrRawValue<SpaceToken>;
  radius?: TokenOrRawValue<RadiusToken>;
  fontSize?: TokenOrRawValue<FontSizeToken>;
  fontWeight?: TokenOrRawValue<FontWeightToken>;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  textColor?: ColorTokenOrRawValue;
  background?: ColorTokenOrRawValue | 'transparent';
  hoverBackground?: ColorTokenOrRawValue | 'transparent';
  activeBackground?: ColorTokenOrRawValue | 'transparent';
  border?: ControlBorder;
  borderColor?: ColorTokenOrRawValue;
  shadow?: 'none' | ShadowToken;
  hoverFilter?: string;
  activeTransform?: string;
}

interface ControlsProps {
  spec?: ControlSpec;
  icon?: ControlIconName;
  children?: ReactNode;
}

const NON_FORWARD_PROPS = new Set<string>(['spec', 'icon']);

function toFontSize(theme: Theme, value?: TokenOrRawValue<FontSizeToken>): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (Object.prototype.hasOwnProperty.call(theme.fontSizes, value)) {
    return theme.fontSizes[value as FontSizeToken];
  }
  return value;
}

function toFontWeight(theme: Theme, value?: TokenOrRawValue<FontWeightToken>): string | number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return value;
  }
  if (Object.prototype.hasOwnProperty.call(theme.fontWeights, value)) {
    return theme.fontWeights[value as FontWeightToken];
  }
  return value;
}

function resolveVariant(theme: Theme, variant: ControlVariant) {
  switch (variant) {
    case 'primary':
      return {
        textColor: theme.colors.accentText,
        background: theme.colors.accent,
        borderColor: 'transparent',
        hoverBackground: theme.colors.accentHover,
        activeBackground: theme.colors.accentActive,
        hoverFilter: undefined,
      };
    case 'destructive':
      return {
        textColor: theme.colors.textInverse,
        background: theme.colors.dangerText,
        borderColor: 'transparent',
        hoverBackground: theme.colors.dangerText,
        activeBackground: undefined,
        hoverFilter: 'brightness(1.05)',
      };
    default:
      return {
        textColor: theme.colors.text,
        background: 'transparent',
        borderColor: theme.colors.border,
        hoverBackground: 'rgba(255, 255, 255, 0.04)',
        activeBackground: undefined,
        hoverFilter: undefined,
      };
  }
}

function resolveShadow(theme: Theme, shadow?: ControlSpec['shadow']) {
  if (shadow === 'none') return 'none';
  return theme.shadows[shadow ?? 'sm'];
}

function toIconExportName(icon: ControlIconName): RadixIconExportName {
  if (icon.endsWith('Icon')) {
    return icon as RadixIconExportName;
  }
  return `${icon.charAt(0).toUpperCase()}${icon.slice(1)}Icon` as RadixIconExportName;
}

function resolveIconNode(icon?: ControlIconName): ReactNode {
  if (!icon) return undefined;
  const iconExportName = toIconExportName(icon);
  if (!(iconExportName in RadixIcons)) return undefined;
  const IconComponent = RadixIcons[iconExportName] as ComponentType<{ 'aria-hidden'?: boolean }>;
  return createElement(IconComponent, { 'aria-hidden': true });
}

const ControlsBase = styled.button.withConfig({
  shouldForwardProp: (prop) => !NON_FORWARD_PROPS.has(String(prop)),
})<ControlsProps>`
  ${({ theme, spec, icon }) => {
    const resolvedIcon = icon ?? spec?.icon;
    const variant = resolveVariant(theme, spec?.variant ?? 'default');
    const sizeToken: ControlSizeToken = spec?.size ?? (spec?.iconOnly ? 'sm' : 'md');
    const iconSizeToken: IconSizeToken = spec?.iconSize ?? sizeToken;

    const resolvedWidth = toCssSize(spec?.width) ?? (spec?.iconOnly ? theme.controlSizes[sizeToken] : undefined);
    const resolvedHeight = toCssSize(spec?.height) ?? theme.controlSizes[sizeToken];
    const minWidth = toCssSize(spec?.minWidth);
    const maxWidth = toCssSize(spec?.maxWidth);
    const minHeight = toCssSize(spec?.minHeight);
    const maxHeight = toCssSize(spec?.maxHeight);

    const padding = toSpace(theme, spec?.padding);
    const paddingX = toSpace(theme, spec?.paddingX) ?? (spec?.iconOnly ? '0px' : theme.space[3]);
    const paddingY = toSpace(theme, spec?.paddingY) ?? '0px';

    const radius = toRadius(theme, spec?.radius) ?? theme.radii.md;
    const gap = toSpace(theme, spec?.gap) ?? theme.space[2];
    const fontSize = toFontSize(theme, spec?.fontSize) ?? theme.fontSizes.base;
    const fontWeight = toFontWeight(theme, spec?.fontWeight) ?? theme.fontWeights.medium;
    const textColor = resolveColor(theme, spec?.textColor) ?? variant.textColor;
    const background = resolveColor(theme, spec?.background) ?? variant.background;
    const hoverBackground = resolveColor(theme, spec?.hoverBackground) ?? variant.hoverBackground;
    const activeBackground = resolveColor(theme, spec?.activeBackground) ?? variant.activeBackground;

    const borderMode = spec?.border ?? 'default';
    const borderColor = resolveColor(theme, spec?.borderColor) ?? variant.borderColor;
    const boxShadow = resolveShadow(theme, spec?.shadow);
    const hoverFilter = spec?.hoverFilter ?? variant.hoverFilter;
    const activeTransform = spec?.activeTransform ?? 'translateY(1px)';
    const shouldStyleIcon = Boolean(resolvedIcon || spec?.iconOnly || spec?.iconSize);

    return css`
      ${resolvedWidth ? `width: ${resolvedWidth};` : ''}
      ${resolvedHeight ? `height: ${resolvedHeight};` : ''}
      ${minWidth ? `min-width: ${minWidth};` : ''}
      ${maxWidth ? `max-width: ${maxWidth};` : ''}
      ${minHeight ? `min-height: ${minHeight};` : ''}
      ${maxHeight ? `max-height: ${maxHeight};` : ''}

      ${padding
    ? `padding: ${padding};`
    : `padding: ${paddingY} ${paddingX};`}
      ${spec?.align ? `align-items: ${spec.align};` : 'align-items: center;'}
      ${spec?.justify ? `justify-content: ${spec.justify};` : spec?.iconOnly ? 'justify-content: center;' : ''}
      ${gap ? `gap: ${gap};` : ''}

      border-radius: ${radius};
      ${borderMode === 'none'
    ? 'border: none;'
    : borderMode === 'transparent'
      ? 'border: 1px solid transparent;'
      : `border: 1px solid ${borderColor};`}
      ${fontSize ? `font-size: ${fontSize};` : ''}
      ${fontWeight ? `font-weight: ${fontWeight};` : ''}
      font-family: inherit;
      color: ${textColor};
      background-color: ${background};
      box-shadow: ${boxShadow};
      transition:
        transform ${theme.motion.duration.fast} ${theme.motion.easing.standard},
        background ${theme.motion.duration.normal} ${theme.motion.easing.standard},
        border-color ${theme.motion.duration.normal} ${theme.motion.easing.standard};
      outline: none;
      cursor: pointer;
      display: inline-flex;

      &:hover {
        ${hoverBackground ? `background-color: ${hoverBackground};` : ''}
        ${hoverFilter ? `filter: ${hoverFilter};` : ''}
      }

      &:active {
        ${activeTransform ? `transform: ${activeTransform};` : ''}
        ${activeBackground ? `background-color: ${activeBackground};` : ''}
      }

      &:focus-visible {
        box-shadow:
          0 0 0 3px ${theme.colors.surface},
          0 0 0 6px ${theme.colors.focusRing};
      }

      ${shouldStyleIcon
    ? css`
            & > svg {
              width: ${theme.iconSizes[iconSizeToken]};
              height: ${theme.iconSizes[iconSizeToken]};
              color: inherit;
              flex-shrink: 0;
            }
          `
    : ''}
    `;
  }}
`;

export type ControlsBuildFn = (spec: ControlSpec) => typeof ControlsBase;
type ControlsComponent = typeof ControlsBase & { build: ControlsBuildFn };

const buildControls: ControlsBuildFn = (spec) => styled(ControlsBase).attrs<ControlsProps>((props) => {
  const resolvedIcon = props.icon ?? spec.icon;
  return {
    spec,
    icon: resolvedIcon,
    children: props.children ?? resolveIconNode(resolvedIcon),
  };
})``;

export const Controls: ControlsComponent = Object.assign(ControlsBase, {
  build: buildControls,
});
