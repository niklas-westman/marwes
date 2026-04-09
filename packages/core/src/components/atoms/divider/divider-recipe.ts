import type { CssVars } from "../../../shared/css-vars"
import type {
  DividerOptions,
  DividerOrientation,
  DividerRenderKit,
  DividerSize,
} from "./divider-types"

const DIVIDER_LINE_THICKNESS_PX = 1

const DIVIDER_SPACING_BY_SIZE: Record<DividerSize, number> = {
  xxs: 1,
  xs: 8,
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 80,
}

export function createDividerRecipe(options: DividerOptions = {}): DividerRenderKit {
  const size: DividerSize = options.size ?? "md"
  const orientation: DividerOrientation = options.orientation ?? "horizontal"

  const vars: CssVars = {
    "--mw-divider-line-thickness": `${DIVIDER_LINE_THICKNESS_PX}px`,
    "--mw-divider-spacing": `${DIVIDER_SPACING_BY_SIZE[size]}px`,
  }

  return {
    tag: "hr",
    className: ["mw-divider", `mw-divider--${orientation}`, `mw-divider--${size}`].join(" "),
    vars,
    a11y: {
      ...(options.id ? { id: options.id } : {}),
      role: "separator",
      "aria-orientation": orientation,
    },
    dataAttributes: {
      "data-component": "divider",
      "data-orientation": orientation,
      "data-size": size,
    },
  }
}
