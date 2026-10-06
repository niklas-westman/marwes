import type { BadgeGroupRenderKit } from "./badge-group-types"

export function createBadgeGroupRecipe(opts: { id: string }): BadgeGroupRenderKit {
  const labelId = `${opts.id}-label`

  return {
    className: "mw-badge-group",
    labelId,
    a11y: { ariaLabelledBy: labelId },
  }
}
