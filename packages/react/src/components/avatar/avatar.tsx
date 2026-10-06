import {
  type AvatarOptions,
  type AvatarRenderContent,
  type CssVars,
  createAvatarRecipe,
  toAvatarHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"
import { Icon } from "../icon"

type StyleWithVars = React.CSSProperties & CssVars

export interface AvatarProps
  extends AvatarOptions,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  dataAttributes?: Record<string, string>
}

function renderAvatarContent(
  content: AvatarRenderContent,
  isOuterShellAccessible: boolean,
  isDecorative: boolean,
): React.ReactNode {
  if (content.type === "image") {
    return (
      <img
        className="mw-avatar__image"
        src={content.src}
        alt={isDecorative ? "" : (content.alt ?? "")}
      />
    )
  }

  if (content.type === "initials") {
    return (
      <span
        aria-hidden={isOuterShellAccessible ? "true" : undefined}
        className="mw-avatar__initials"
      >
        {content.initials}
      </span>
    )
  }

  return <Icon name={content.iconName ?? "user"} className="mw-avatar__icon" decorative />
}

export function Avatar(props: AvatarProps): React.ReactElement {
  const {
    className,
    style,
    dataAttributes,
    size,
    type,
    initials,
    src,
    alt,
    iconName,
    decorative,
    ariaLabel,
    label,
    ...nativeSpanProps
  } = props

  const ariaLabelFromNativeProps =
    typeof nativeSpanProps["aria-label"] === "string" ? nativeSpanProps["aria-label"] : undefined

  const avatarOptions: AvatarOptions = {}
  if (size !== undefined) avatarOptions.size = size
  if (type !== undefined) avatarOptions.type = type
  if (initials !== undefined) avatarOptions.initials = initials
  if (src !== undefined) avatarOptions.src = src
  if (alt !== undefined) avatarOptions.alt = alt
  if (iconName !== undefined) avatarOptions.iconName = iconName
  if (decorative !== undefined) avatarOptions.decorative = decorative
  if (label !== undefined) avatarOptions.label = label

  const resolvedAriaLabel = ariaLabel ?? ariaLabelFromNativeProps
  if (resolvedAriaLabel !== undefined) {
    avatarOptions.ariaLabel = resolvedAriaLabel
  }

  const kit = createAvatarRecipe(avatarOptions)

  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")
  const mergedStyle = { ...(kit.vars as StyleWithVars), ...style }
  const isOuterShellAccessible = kit.a11y.role === "img"
  const isDecorative = kit.a11y.ariaHidden === true

  return (
    <span
      {...nativeSpanProps}
      {...kit.dataAttributes}
      {...dataAttributes}
      className={mergedClassName}
      style={mergedStyle}
      {...toReactAttributes(toAvatarHtmlAttributes(kit.a11y))}
    >
      {renderAvatarContent(kit.content, isOuterShellAccessible, isDecorative)}
    </span>
  )
}
