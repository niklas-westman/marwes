import {
  createAvatarGroupRecipe,
  toAvatarGroupCounterHtmlAttributes,
  toAvatarGroupHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"
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
  /** Alias for `ariaLabel`. */
  label?: string
  dataAttributes?: Record<string, string>
}

export function AvatarGroup(props: AvatarGroupProps): React.ReactElement {
  const {
    items,
    overflowCount,
    overflowLabel,
    ariaLabel,
    label,
    className,
    dataAttributes,
    ...nativeFieldsetProps
  } = props

  const nativeAriaLabel =
    typeof nativeFieldsetProps["aria-label"] === "string"
      ? nativeFieldsetProps["aria-label"]
      : undefined
  const kit = createAvatarGroupRecipe({
    ...(overflowCount !== undefined ? { overflowCount } : {}),
    ...(overflowLabel !== undefined ? { overflowLabel } : {}),
    ...((ariaLabel ?? nativeAriaLabel) !== undefined
      ? { ariaLabel: (ariaLabel ?? nativeAriaLabel) as string }
      : {}),
    ...(label !== undefined ? { label } : {}),
  })
  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")

  return (
    <fieldset
      {...nativeFieldsetProps}
      {...dataAttributes}
      className={mergedClassName}
      {...kit.dataAttributes}
      {...toReactAttributes(toAvatarGroupHtmlAttributes(kit.a11y))}
    >
      {items.map((item, itemIndex) => (
        <span
          className="mw-avatar-group__item"
          key={item.id ?? `${itemIndex}-${item.initials ?? item.alt ?? "avatar"}`}
        >
          <Avatar {...item} size="medium" />
        </span>
      ))}

      {kit.counter.visible ? (
        <span
          className="mw-avatar-group__counter"
          {...toReactAttributes(toAvatarGroupCounterHtmlAttributes(kit.counter.a11y))}
        >
          {kit.counter.text}
        </span>
      ) : null}
    </fieldset>
  )
}
