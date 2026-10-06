import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { AvatarA11yProps } from "./avatar-types"

const avatarHtmlAttributeNames = {
  role: "role",
  ariaHidden: "aria-hidden",
  ariaLabel: "aria-label",
} as const

export type AvatarHtmlAttributes = HtmlAttributesOf<
  AvatarA11yProps,
  typeof avatarHtmlAttributeNames
>

/** Translates resolved avatar a11y fields into HTML attribute names. */
export const toAvatarHtmlAttributes =
  defineHtmlAttributeMapper<AvatarA11yProps>()(avatarHtmlAttributeNames)
