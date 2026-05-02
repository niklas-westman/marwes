/**
 * React adapter for Marwes Accordion.
 * - Renders a compound structure: wrapper div > trigger button + panel div.
 * - id is optional; falls back to React.useId() for aria wiring.
 */

import { createAccordionRecipe } from "@marwes-ui/core"
import * as React from "react"

export interface AccordionProps {
  /** Unique id for aria wiring. Defaults to React.useId() when omitted. */
  id?: string
  open?: boolean
  disabled?: boolean
  /** Content of the trigger button header */
  title: React.ReactNode
  /** Content shown in the collapsible panel */
  children: React.ReactNode
  className?: string
  /** Called when the trigger is clicked */
  onToggle?: () => void
}

export function Accordion(props: AccordionProps): React.ReactElement {
  const { title, children, className, onToggle, id: idProp, open, disabled } = props
  const autoId = React.useId()
  const resolvedId = idProp ?? autoId.replace(/:/g, "")

  const opts: import("@marwes-ui/core").AccordionOptions = { id: resolvedId }
  if (open !== undefined) opts.open = open
  if (disabled !== undefined) opts.disabled = disabled
  const kit = createAccordionRecipe(opts)
  const { a11y } = kit

  function handleTriggerClick(): void {
    if (disabled) return
    onToggle?.()
  }

  return (
    <div className={[kit.className, className].filter(Boolean).join(" ")}>
      <button
        id={a11y.triggerId}
        type="button"
        className="mw-accordion__trigger"
        aria-expanded={a11y.ariaExpanded}
        aria-controls={a11y.panelId}
        aria-disabled={a11y.ariaDisabled}
        disabled={disabled}
        onClick={handleTriggerClick}
      >
        <span className="mw-accordion__title">{title}</span>
        <span className="mw-accordion__icon" aria-hidden="true" />
      </button>
      <section
        id={a11y.panelId}
        aria-labelledby={a11y.triggerId}
        className="mw-accordion__panel"
        hidden={!open}
      >
        <div className="mw-accordion__content">{children}</div>
      </section>
    </div>
  )
}
