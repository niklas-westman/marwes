/**
 * Core types for Accordion.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 * - id is required — adapters derive aria IDs for trigger and panel from it.
 */

export interface AccordionOptions {
  /** Must be unique per page — used to derive triggerId and panelId for aria wiring. */
  id: string
  open?: boolean
  disabled?: boolean
}

export interface AccordionA11yProps {
  /** id applied to the trigger <button> */
  triggerId: string
  /** id applied to the content panel */
  panelId: string
  ariaExpanded: boolean
  ariaDisabled?: true
}

export interface AccordionRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  /** @deprecated Use `trigger.a11y` and `panel.a11y`. */
  a11y: AccordionA11yProps
  trigger: { a11y: AccordionTriggerA11yProps }
  panel: { a11y: AccordionPanelA11yProps }
}

/** ARIA fields for the AccordionField wrapper element. */
export interface AccordionFieldA11yProps {
  ariaLabelledBy: string
  ariaDescribedBy?: string
  ariaInvalid?: true
}

/** ARIA fields for the accordion trigger button. */
export interface AccordionTriggerA11yProps {
  id: string
  ariaExpanded: boolean
  ariaControls: string
  ariaDisabled?: true
}

/** ARIA fields for the accordion content panel, labelled by its trigger. */
export interface AccordionPanelA11yProps {
  id: string
  role: "region"
  ariaLabelledBy: string
}
