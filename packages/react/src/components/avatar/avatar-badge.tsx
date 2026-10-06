import {
  type AvatarOptions,
  createAvatarBadgeRecipe,
  toAvatarBadgeHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"
import { Avatar, type AvatarProps } from "./avatar"

export interface AvatarBadgeProps extends AvatarProps {
  statusLabel?: string
}

function buildAvatarOptions(props: AvatarBadgeProps): AvatarOptions {
  const avatarOptions: AvatarOptions = {}
  if (props.size !== undefined) avatarOptions.size = props.size
  if (props.type !== undefined) avatarOptions.type = props.type
  if (props.initials !== undefined) avatarOptions.initials = props.initials
  if (props.src !== undefined) avatarOptions.src = props.src
  if (props.alt !== undefined) avatarOptions.alt = props.alt
  if (props.iconName !== undefined) avatarOptions.iconName = props.iconName
  if (props.decorative !== undefined) avatarOptions.decorative = props.decorative
  if (props.label !== undefined) avatarOptions.label = props.label

  const nativeAriaLabel = typeof props["aria-label"] === "string" ? props["aria-label"] : undefined
  const resolvedAriaLabel = props.ariaLabel ?? nativeAriaLabel
  if (resolvedAriaLabel !== undefined) {
    avatarOptions.ariaLabel = resolvedAriaLabel
  }

  return avatarOptions
}

export function AvatarBadge(props: AvatarBadgeProps): React.ReactElement {
  const {
    className,
    dataAttributes,
    statusLabel,
    decorative,
    style,
    size,
    type,
    initials,
    src,
    alt,
    iconName,
    ariaLabel,
    label,
    ...nativeSpanProps
  } = props

  const avatarOptions = buildAvatarOptions(props)
  const badgeKit = createAvatarBadgeRecipe({
    ...avatarOptions,
    ...(statusLabel !== undefined ? { statusLabel } : {}),
  })
  const mergedClassName = [badgeKit.className, className].filter(Boolean).join(" ")
  const innerAvatarProps: AvatarProps = { decorative: true }
  if (size !== undefined) innerAvatarProps.size = size
  if (type !== undefined) innerAvatarProps.type = type
  if (initials !== undefined) innerAvatarProps.initials = initials
  if (src !== undefined) innerAvatarProps.src = src
  if (alt !== undefined) innerAvatarProps.alt = alt
  if (iconName !== undefined) innerAvatarProps.iconName = iconName
  if (ariaLabel !== undefined) innerAvatarProps.ariaLabel = ariaLabel
  if (label !== undefined) innerAvatarProps.label = label

  return (
    <span
      {...nativeSpanProps}
      {...dataAttributes}
      className={mergedClassName}
      style={style}
      {...badgeKit.dataAttributes}
      {...toReactAttributes(toAvatarBadgeHtmlAttributes(badgeKit.a11y))}
    >
      <Avatar {...innerAvatarProps} />
      <span aria-hidden="true" className="mw-avatar-badge__indicator" />
    </span>
  )
}
