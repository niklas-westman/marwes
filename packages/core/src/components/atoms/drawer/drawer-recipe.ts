import { createFamilySemanticAttributes } from "../../../semantics"
import { resolveDrawerA11y } from "./drawer-a11y"
import type { DrawerOptions, DrawerRenderKit } from "./drawer-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createDrawerRecipe(opts: DrawerOptions = {}): DrawerRenderKit {
  const size = opts.size ?? "medium"
  const placement = opts.placement ?? "right"
  const showFooter = opts.showFooter ?? true
  const showCloseButton = opts.dismissible ?? true
  const showScrim = opts.showScrim ?? true
  const rootDataAttributes = {
    ...createFamilySemanticAttributes("drawer", {
      "data-size": size,
    }),
    "data-placement": placement,
    "data-footer": showFooter ? "true" : "false",
    "data-dismissible": showCloseButton ? "true" : "false",
    "data-scrim": showScrim ? "true" : "false",
    ...opts.dataAttributes,
  }

  return {
    tag: "div",
    className: cx(
      "mw-drawer",
      `mw-drawer--${placement}`,
      `mw-drawer--${size}`,
      showFooter ? "mw-drawer--with-footer" : "mw-drawer--without-footer",
      showScrim && "mw-drawer--with-scrim",
      showCloseButton && "mw-drawer--dismissible",
    ),
    vars: {},
    size,
    placement,
    showFooter,
    showCloseButton,
    showScrim,
    dataAttributes: rootDataAttributes,
    panel: {
      tag: "aside",
      className: "mw-drawer__panel",
      vars: {},
      a11y: resolveDrawerA11y(opts),
      dataAttributes: {
        ...rootDataAttributes,
        "data-part": "panel",
      },
    },
    scrim: {
      tag: "div",
      className: "mw-drawer__scrim",
      vars: {},
      dataAttributes: {
        "data-component": "drawer",
        "data-part": "scrim",
        "data-placement": placement,
      },
    },
  }
}
