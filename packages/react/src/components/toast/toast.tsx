import { createToastRecipe } from "@marwes-ui/core"
import type { ToastOptions } from "@marwes-ui/core"
import type * as React from "react"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export interface ToastProps extends ToastOptions {
  /** Main notification message */
  children: React.ReactNode
  /** Icon element shown on the left (e.g. an <Icon> component) */
  icon?: React.ReactNode
  /** Action element shown inline after the message (e.g. a text action or <a>) */
  action?: React.ReactNode
  /** When provided, renders a dismiss (×) button and calls this on click */
  onDismiss?: () => void
  className?: string
  id?: string
  dataAttributes?: Record<string, string>
}

export function Toast(props: ToastProps): React.ReactElement {
  const { children, icon, action, onDismiss, className, id, dataAttributes, ...coreProps } = props
  const kit = createToastRecipe(coreProps)
  const { a11y } = kit

  return (
    <div
      id={id}
      className={cx(kit.className, className)}
      role={a11y.role}
      aria-live={a11y.ariaLive}
      aria-atomic="true"
      {...kit.dataAttributes}
      {...dataAttributes}
    >
      {icon && (
        <span className="mw-toast__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="mw-toast__body">
        <span className="mw-toast__text">{children}</span>
        {action && <span className="mw-toast__action">{action}</span>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="mw-toast__dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        />
      )}
    </div>
  )
}
