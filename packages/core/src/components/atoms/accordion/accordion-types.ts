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
  a11y: AccordionA11yProps
}
