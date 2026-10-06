import type { CssVars } from "../../../shared/css-vars"
import type { IconName } from "../icon/icon-types"

export const AvatarSize = {
  small: "small",
  medium: "medium",
  large: "large",
} as const
export type AvatarSize = (typeof AvatarSize)[keyof typeof AvatarSize]

export const AvatarType = {
  initials: "initials",
  icon: "icon",
  image: "image",
} as const
export type AvatarType = (typeof AvatarType)[keyof typeof AvatarType]

export interface AvatarOptions {
  size?: AvatarSize
  type?: AvatarType
  initials?: string
  src?: string
  alt?: string
  iconName?: IconName
  decorative?: boolean
  ariaLabel?: string
  label?: string
}

export interface AvatarA11yProps {
  role?: "img"
  ariaHidden?: true
  ariaLabel?: string
}

/** ARIA fields for the initials text inside the avatar shell. */
export interface AvatarInitialsA11yProps {
  /** Set when the shell is already a labelled image, so the text is not announced twice. */
  ariaHidden?: true
}

export interface AvatarDataAttributes extends Record<string, string> {
  "data-component": "avatar"
  "data-size": AvatarSize
  "data-type": AvatarType
}

export interface AvatarRenderContent {
  type: AvatarType
  initials?: string
  src?: string
  alt?: string
  iconName?: IconName
}

export interface AvatarRenderKit {
  tag: "span"
  className: string
  vars: CssVars
  a11y: AvatarA11yProps
  initialsA11y: AvatarInitialsA11yProps
  dataAttributes: AvatarDataAttributes
  content: AvatarRenderContent
}
