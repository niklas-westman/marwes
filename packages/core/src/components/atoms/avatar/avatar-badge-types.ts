import type { AvatarOptions, AvatarSize } from "./avatar-types"

export interface AvatarBadgeOptions extends AvatarOptions {
  /** Status announced after the avatar name, e.g. "Away". Defaults to "Online". */
  statusLabel?: string
}

/** ARIA fields for the avatar badge shell: one image labelled "{name}, {status}" unless decorative. */
export interface AvatarBadgeA11yProps {
  role?: "img"
  ariaHidden?: true
  ariaLabel?: string
}

export interface AvatarBadgeRenderKit {
  className: string
  size: AvatarSize
  dataAttributes: {
    "data-component": "avatar-badge"
    "data-size": AvatarSize
    "data-status": "online"
  }
  a11y: AvatarBadgeA11yProps
}
