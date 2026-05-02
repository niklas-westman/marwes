import type { AccordionA11yProps, AccordionOptions } from "./accordion-types"

export function resolveAccordionA11y(opts: AccordionOptions): AccordionA11yProps {
  const a11y: AccordionA11yProps = {
    triggerId: `${opts.id}-trigger`,
    panelId: `${opts.id}-panel`,
    ariaExpanded: opts.open ?? false,
  }

  if (opts.disabled) a11y.ariaDisabled = true

  return a11y
}
