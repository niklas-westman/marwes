import type { ButtonOptions, ButtonVariant, CssVars } from "@marwes-ui/core"
import { createButtonRecipe } from "@marwes-ui/core"
import type * as React from "react"
import { Icon } from "../icon"
import { ButtonSpinner } from "../spinner"

type StyleWithVars = React.CSSProperties & CssVars

function isFilledButtonVariant(variant: ButtonVariant): boolean {
  return variant === "primary" || variant === "success"
}

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

  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className

  const resolvedVariant = (props.variant ?? "primary") as ButtonVariant
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
          inverted={isFilledButtonVariant(resolvedVariant)}
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
        type={kit.a11y.type}
        disabled={kit.a11y.disabled}
        aria-label={kit.a11y.ariaLabel}
        aria-busy={kit.a11y.ariaBusy}
        aria-disabled={kit.a11y.ariaDisabled}
        aria-pressed={kit.a11y.ariaPressed}
        aria-expanded={kit.a11y.ariaExpanded}
        aria-controls={kit.a11y.ariaControls}
        title={kit.a11y.title}
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
      href={kit.a11y.href}
      role={kit.a11y.role}
      tabIndex={kit.a11y.tabIndex}
      aria-label={kit.a11y.ariaLabel}
      aria-busy={kit.a11y.ariaBusy}
      aria-disabled={kit.a11y.ariaDisabled}
      aria-pressed={kit.a11y.ariaPressed}
      aria-expanded={kit.a11y.ariaExpanded}
      aria-controls={kit.a11y.ariaControls}
      title={kit.a11y.title}
      className={className}
      style={style}
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
