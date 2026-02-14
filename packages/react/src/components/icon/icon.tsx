import * as React from "react";
import {
  iconRegistry,
  resolveIconSize,
  resolveIconStrokeWidth,
  type IconSize,
  type IconStrokeWidth,
} from "@marwes/core";
import { useTheme } from "../../provider/use-theme";

type IconName = keyof typeof iconRegistry;

export type IconProps = {
  name: IconName;

  /**
   * Token ("xs"|"sm"|"md"|"lg") or a raw px number.
   * Defaults to system.theme.icon.size
   */
  size?: IconSize | number;

  /**
   * Token ("xs"|"sm"|"md"|"lg") or a raw number.
   * Defaults to system.theme.icon.strokeWidth
   */
  strokeWidth?: IconStrokeWidth | number;

  /**
   * Common props
   */
  className?: string;
  "aria-label"?: string;
  decorative?: boolean;
};

export function Icon({
  name,
  size,
  strokeWidth,
  className,
  "aria-label": ariaLabel,
  decorative,
}: IconProps) {
  const theme = useTheme();
  const themeIcon = theme.icon;

  const px = resolveIconSize(size ?? themeIcon.size);
  const sw = resolveIconStrokeWidth(strokeWidth ?? themeIcon.strokeWidth);

  const def = iconRegistry[name];

  // If no aria-label => decorative
  const isDecorative = decorative || !ariaLabel;

  return (
    <svg
      width={px}
      height={px}
      viewBox={def.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={isDecorative ? "true" : undefined}
      aria-label={ariaLabel}
      role={isDecorative ? undefined : "img"}
      focusable="false"
    >
      {def.nodes.map((n, i) => {
        const Tag = n.tag as keyof JSX.IntrinsicElements;
        return <Tag key={i} {...(n.attrs as any)} />;
      })}
    </svg>
  );
}
