import { type AvatarOptions, createAvatarRecipe } from "@marwes-ui/core"
import type * as React from "react"
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

  const nativeAriaLabel = typeof props["aria-label"] === "string" ? props["aria-label"] : undefined
  const resolvedAriaLabel = props.ariaLabel ?? nativeAriaLabel
  if (resolvedAriaLabel !== undefined) {
    avatarOptions.ariaLabel = resolvedAriaLabel
  }

  return avatarOptions
}

function resolveAvatarBadgeLabel(
  avatarOptions: AvatarOptions,
  statusLabel: string,
): string | undefined {
  const avatarKit = createAvatarRecipe(avatarOptions)

  if (avatarKit.a11y.ariaHidden) {
    return undefined
  }

  if (avatarKit.content.type === "image") {
    return avatarKit.content.alt ? `${avatarKit.content.alt}, ${statusLabel}` : statusLabel
  }

  return avatarKit.a11y.ariaLabel ? `${avatarKit.a11y.ariaLabel}, ${statusLabel}` : statusLabel
}

export function AvatarBadge(props: AvatarBadgeProps): React.ReactElement {
  const {
    className,
    dataAttributes,
    statusLabel = "Online",
    decorative,
    style,
    size,
    type,
    initials,
    src,
    alt,
    iconName,
    ariaLabel,
    ...nativeSpanProps
  } = props

  const avatarOptions = buildAvatarOptions(props)
  const avatarKit = createAvatarRecipe(avatarOptions)
  const accessibleLabel = resolveAvatarBadgeLabel(avatarOptions, statusLabel)
  const resolvedSize = avatarKit.dataAttributes["data-size"]
  const mergedClassName = ["mw-avatar-badge", `mw-avatar-badge--${resolvedSize}`, className]
    .filter(Boolean)
    .join(" ")
  const innerAvatarProps: AvatarProps = { decorative: true }
  if (size !== undefined) innerAvatarProps.size = size
  if (type !== undefined) innerAvatarProps.type = type
  if (initials !== undefined) innerAvatarProps.initials = initials
  if (src !== undefined) innerAvatarProps.src = src
  if (alt !== undefined) innerAvatarProps.alt = alt
  if (iconName !== undefined) innerAvatarProps.iconName = iconName
  if (ariaLabel !== undefined) innerAvatarProps.ariaLabel = ariaLabel

  return (
    <span
      {...nativeSpanProps}
      {...dataAttributes}
      className={mergedClassName}
      style={style}
      data-component="avatar-badge"
      data-size={resolvedSize}
      data-status="online"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
    >
      <Avatar {...innerAvatarProps} />
      <span aria-hidden="true" className="mw-avatar-badge__indicator" />
    </span>
  )
}
