/**
 * Divider recipe: theme + options → render kit.
 * - Supports 7 size variants: xxs/xs/sm/md/lg/xl/xxl (maps to 1px-80px).
 * - Supports horizontal and vertical orientation.
 * - Built-in spacing based on divider size.
 * - Figma reference: node-id=1-932
 */

import type { Theme } from "../../../theme/theme-types";
import type { CssVars } from "../../../shared/css-vars";
import type {
  DividerOptions,
  DividerRenderKit,
  DividerSize,
  DividerOrientation,
} from "./divider-types";

/** Saved for later use if to adapt divider size (not spacing) */
const SIZE_MAP: Record<DividerSize, number> = {
  xxs: 1,
  xs: 8,
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 80,
};

/** Map sizes to spacing multipliers for vertical spacing. */
const SPACING_MAP: Record<DividerSize, number> = {
  xxs: 0.5, // 0.5rem for hairline
  xs: 1, // 1rem
  sm: 1.5, // 1.5rem
  md: 2, // 2rem (default)
  lg: 2.5, // 2.5rem
  xl: 3, // 3rem
  xxl: 4, // 4rem
};

export function createDividerRecipe(
  theme: Theme,
  opts: DividerOptions = {},
): DividerRenderKit {
  // Default size to "md", orientation to "horizontal".
  const size: DividerSize = opts.size ?? "md";
  const orientation: DividerOrientation = opts.orientation ?? "horizontal";

  // Build class name.
  const className = [
    "mw-divider",
    `mw-divider--${orientation}`,
    `mw-divider--${size}`,
  ]
    .filter(Boolean)
    .join(" ");

  // Get pixel value for size.
  const sizeValue = 2;
  const spacingValue = SPACING_MAP[size];

  // CSS variables.
  const vars: CssVars = {
    "--mw-divider-color": theme.color.border,
    "--mw-divider-size": `${sizeValue}px`,
    "--mw-divider-spacing": `${spacingValue}rem`,
  };

  // Build a11y props.
  const a11y: DividerRenderKit["a11y"] = {
    role: "separator",
    "aria-orientation": orientation,
  };
  if (opts.id) a11y.id = opts.id;

  // Data attributes for styling hooks.
  const dataAttributes: DividerRenderKit["dataAttributes"] = {
    "data-orientation": orientation,
    "data-size": size,
  };

  return {
    tag: "hr",
    className,
    vars,
    a11y,
    dataAttributes,
  };
}
