import type {
  AvatarBadgeA11yProps,
  AvatarBadgeOptions,
  AvatarBadgeRenderKit,
} from "./avatar-badge-types"
import { createAvatarRecipe } from "./avatar-recipe"

const DEFAULT_STATUS_LABEL = "Online"

export function createAvatarBadgeRecipe(opts: AvatarBadgeOptions = {}): AvatarBadgeRenderKit {
  const { statusLabel = DEFAULT_STATUS_LABEL, ...avatarOptions } = opts
  const avatarKit = createAvatarRecipe(avatarOptions)
  const size = avatarKit.dataAttributes["data-size"]

  const a11y: AvatarBadgeA11yProps = {}
  if (opts.decorative) {
    a11y.ariaHidden = true
  } else {
    a11y.role = "img"
    a11y.ariaLabel = composeAvatarBadgeLabel(avatarKit, statusLabel)
  }

  return {
    className: ["mw-avatar-badge", `mw-avatar-badge--${size}`].join(" "),
    size,
    dataAttributes: {
      "data-component": "avatar-badge",
      "data-size": size,
      "data-status": "online",
    },
    a11y,
  }
}

function composeAvatarBadgeLabel(
  avatarKit: ReturnType<typeof createAvatarRecipe>,
  statusLabel: string,
): string {
  const name = avatarKit.content.type === "image" ? avatarKit.content.alt : avatarKit.a11y.ariaLabel

  return name ? `${name}, ${statusLabel}` : statusLabel
}
