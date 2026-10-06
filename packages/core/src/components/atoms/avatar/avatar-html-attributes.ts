import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { AvatarBadgeA11yProps } from "./avatar-badge-types"
import type { AvatarGroupA11yProps, AvatarGroupCounterA11yProps } from "./avatar-group-types"
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

const avatarGroupHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type AvatarGroupHtmlAttributes = HtmlAttributesOf<
  AvatarGroupA11yProps,
  typeof avatarGroupHtmlAttributeNames
>

/** Translates resolved avatar group a11y fields into HTML attribute names. */
export const toAvatarGroupHtmlAttributes = defineHtmlAttributeMapper<AvatarGroupA11yProps>()(
  avatarGroupHtmlAttributeNames,
)

const avatarGroupCounterHtmlAttributeNames = {
  role: "role",
  ariaLabel: "aria-label",
} as const

export type AvatarGroupCounterHtmlAttributes = HtmlAttributesOf<
  AvatarGroupCounterA11yProps,
  typeof avatarGroupCounterHtmlAttributeNames
>

/** Translates resolved avatar group counter a11y fields into HTML attribute names. */
export const toAvatarGroupCounterHtmlAttributes =
  defineHtmlAttributeMapper<AvatarGroupCounterA11yProps>()(avatarGroupCounterHtmlAttributeNames)

const avatarBadgeHtmlAttributeNames = {
  role: "role",
  ariaHidden: "aria-hidden",
  ariaLabel: "aria-label",
} as const

export type AvatarBadgeHtmlAttributes = HtmlAttributesOf<
  AvatarBadgeA11yProps,
  typeof avatarBadgeHtmlAttributeNames
>

/** Translates resolved avatar badge a11y fields into HTML attribute names. */
export const toAvatarBadgeHtmlAttributes = defineHtmlAttributeMapper<AvatarBadgeA11yProps>()(
  avatarBadgeHtmlAttributeNames,
)
