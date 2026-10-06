import type { ButtonOptions, CssVars } from "@marwes-ui/core"
import { createButtonRecipe, toButtonHtmlAttributes } from "@marwes-ui/core"
import type * as React from "react"
import { Icon } from "../icon"
import { ButtonSpinner } from "../spinner"

type StyleWithVars = React.CSSProperties & CssVars

function hasRenderableLabel(label: React.ReactNode): boolean {
  if (label === undefined || label === null || label === false) return false
  if (typeof label === "string") return label.length > 0
  return true
}

export type ButtonProps = ButtonOptions & {
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  className?: string
}

export function Button(props: ButtonProps) {
  const kit = createButtonRecipe(props)

  // React names the attribute tabIndex; the helper emits the HTML name
  const { tabindex: tabIndex, ...htmlAttributes } = toButtonHtmlAttributes(kit.a11y)
  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className

  const resolvedLoading = kit.loading
  const visibleLabel =
    resolvedLoading.isLoading && resolvedLoading.loadingLabel !== undefined
      ? resolvedLoading.loadingLabel
      : props.children

  const content = (
    <>
      {resolvedLoading.isLoading ? (
        <ButtonSpinner
          variant={resolvedLoading.spinnerVariant}
          inverted={resolvedLoading.spinnerInverted}
        />
      ) : props.iconLeft ? (
        <Icon name={props.iconLeft} size="xs" strokeWidth="sm" decorative />
      ) : null}
      {hasRenderableLabel(visibleLabel) ? (
        <span className="mw-btn__label">{visibleLabel}</span>
      ) : null}
      {!resolvedLoading.isLoading && props.iconRight ? (
        <Icon name={props.iconRight} size="xs" strokeWidth="sm" decorative />
      ) : null}
    </>
  )

  if (kit.tag === "button") {
    return (
      <button
        {...htmlAttributes}
        className={className}
        style={style}
        onClick={(e) => props.onClick?.(e)}
        {...kit.dataAttributes}
      >
        {content}
      </button>
    )
  }

  return (
    <a
      {...htmlAttributes}
      tabIndex={tabIndex}
      className={className}
      style={style}
      // biome-ignore lint/a11y/useValidAnchor: href and role come from the spread a11y attributes; a disabled link intentionally has neither
      onClick={(e) => {
        if (kit.blockClick) {
          e.preventDefault()
          return
        }
        props.onClick?.(e)
      }}
      {...kit.dataAttributes}
    >
      {content}
    </a>
  )
}
