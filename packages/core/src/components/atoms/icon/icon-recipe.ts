import { iconRegistry } from "./icon-registry"
import { resolveIconSize, resolveIconStrokeWidth } from "./icon-scales"
import type { IconOptions, IconRenderKit } from "./icon-types"

function resolveIconA11y(opts: IconOptions): IconRenderKit["a11y"] {
  if (!opts.ariaLabel) return { ariaHidden: true }
  return { role: "img", ariaLabel: opts.ariaLabel }
}

export function createIconRecipe(opts: IconOptions): IconRenderKit {
  const def = iconRegistry[opts.name]

  if (!def) {
    throw new Error(`Icon "${opts.name}" not found in registry`)
  }

  // Defaults are hardcoded — icon size and stroke are not theme-derived
  const px = resolveIconSize(opts.size ?? "sm")
  const sw = resolveIconStrokeWidth(opts.strokeWidth ?? "md")
  const color = opts.color ?? "currentColor"

  return {
    tag: "svg",
    className: ["mw-icon", `mw-icon--${px}`, `mw-icon--${color}`].join(" "),
    vars: {
      "--mw-icon-size": `${px}px`,
      "--mw-icon-stroke-width": String(sw),
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
