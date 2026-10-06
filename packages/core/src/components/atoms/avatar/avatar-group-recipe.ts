import type { AvatarGroupOptions, AvatarGroupRenderKit } from "./avatar-group-types"

const DEFAULT_GROUP_LABEL = "Avatar group"

export function createAvatarGroupRecipe(opts: AvatarGroupOptions = {}): AvatarGroupRenderKit {
  const overflowCount = opts.overflowCount ?? 0

  return {
    className: "mw-avatar-group",
    dataAttributes: { "data-component": "avatar-group" },
    a11y: { ariaLabel: opts.ariaLabel ?? opts.label ?? DEFAULT_GROUP_LABEL },
    counter: {
      visible: overflowCount > 0,
      text: `+${overflowCount}`,
      a11y: { role: "img", ariaLabel: opts.overflowLabel ?? `${overflowCount} more people` },
    },
  }
}
