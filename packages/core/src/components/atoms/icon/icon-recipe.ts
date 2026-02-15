import type { Theme } from "../../../theme/theme-types"
import { iconRegistry } from "./icon-registry"
import { resolveIconSize, resolveIconStrokeWidth } from "./icon-scales"
import type { IconOptions, IconRenderKit } from "./icon-types"

function resolveIconA11y(opts: IconOptions): IconRenderKit["a11y"] {
  if (!opts.ariaLabel) return { ariaHidden: true }
  return { role: "img", ariaLabel: opts.ariaLabel }
}

export function createIconRecipe(theme: Theme, opts: IconOptions): IconRenderKit {
  const def = iconRegistry[opts.name]

  if (!def) {
    throw new Error(`Icon "${opts.name}" not found in registry`)
  }

  const px = resolveIconSize(opts.size ?? theme.icon.size)
  const sw = resolveIconStrokeWidth(opts.strokeWidth ?? theme.icon.strokeWidth)
  const color = opts.color ?? "currentColor"

  return {
    tag: "svg",
    className: ["mw-icon", `mw-icon--${px}`, `mw-icon--${color}`].join(" "),
    vars: {
      "--mw-icon-size": `${px}px`,
      "--mw-icon-stroke-width": String(sw),
      "--mw-icon-primary": theme.color.primary,
      "--mw-icon-secondary": theme.color.secondary,
      "--mw-icon-muted": theme.color.textMuted,
    },
    a11y: resolveIconA11y(opts),
    svg: {
      viewBox: def.viewBox,
      nodes: def.nodes,
      width: px,
      height: px,
      type: "stroke",
    },
  }
}
