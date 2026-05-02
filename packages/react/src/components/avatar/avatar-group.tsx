import type * as React from "react"
import { Avatar, type AvatarProps } from "./avatar"

export interface AvatarGroupItem extends Omit<AvatarProps, "size" | "className" | "style"> {
  id?: string
}

export interface AvatarGroupProps
  extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, "children"> {
  items: AvatarGroupItem[]
  overflowCount?: number
  overflowLabel?: string
  ariaLabel?: string
  dataAttributes?: Record<string, string>
}

export function AvatarGroup(props: AvatarGroupProps): React.ReactElement {
  const {
    items,
    overflowCount,
    overflowLabel,
    ariaLabel,
    className,
    dataAttributes,
    ...nativeFieldsetProps
  } = props

  const nativeAriaLabel =
    typeof nativeFieldsetProps["aria-label"] === "string"
      ? nativeFieldsetProps["aria-label"]
      : undefined
  const groupLabel = ariaLabel ?? nativeAriaLabel ?? "Avatar group"
  const mergedClassName = ["mw-avatar-group", className].filter(Boolean).join(" ")
  const shouldRenderOverflowCounter = overflowCount !== undefined && overflowCount > 0
  const resolvedOverflowLabel = overflowLabel ?? `${overflowCount} more people`

  return (
    <fieldset
      {...nativeFieldsetProps}
      {...dataAttributes}
      className={mergedClassName}
      data-component="avatar-group"
      aria-label={groupLabel}
    >
      {items.map((item, itemIndex) => (
        <span
          className="mw-avatar-group__item"
          key={item.id ?? `${itemIndex}-${item.initials ?? item.alt ?? "avatar"}`}
        >
          <Avatar {...item} size="medium" />
        </span>
      ))}

      {shouldRenderOverflowCounter ? (
        <span aria-label={resolvedOverflowLabel} className="mw-avatar-group__counter" role="img">
          +{overflowCount}
        </span>
      ) : null}
    </fieldset>
  )
}
