import type { ButtonOptions, CssVars } from "@marwes/core"
import { createButtonRecipe } from "@marwes/core"
import type * as React from "react"
import { useRenderKitDebug } from "../hooks/use-renderkit-debug"
import { useTheme } from "../provider/use-theme"
import { Icon } from "./icon"

type StyleWithVars = React.CSSProperties & CssVars

export type ButtonProps = ButtonOptions & {
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  className?: string
}

export function Button(props: ButtonProps) {
  const theme = useTheme()
  const kit = createButtonRecipe(theme, props)

  // Debug hook for Storybook RenderKit addon
  useRenderKitDebug(kit, "Button")

  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className

  const content = (
    <>
      {props.iconLeft && <Icon name={props.iconLeft} size="xs" decorative />}
      {props.children}
      {props.iconRight && <Icon name={props.iconRight} size="xs" decorative />}
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
