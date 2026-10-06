import type {
  AccordionA11yProps,
  AccordionFieldA11yProps,
  AccordionOptions,
} from "./accordion-types"

export function resolveAccordionA11y(opts: AccordionOptions): AccordionA11yProps {
  const a11y: AccordionA11yProps = {
    triggerId: `${opts.id}-trigger`,
    panelId: `${opts.id}-panel`,
    ariaExpanded: opts.open ?? false,
  }

  if (opts.disabled) a11y.ariaDisabled = true

  return a11y
}

export function resolveAccordionFieldA11y(args: {
  labelId: string
  describedBy?: string | undefined
  invalid?: boolean | undefined
}): AccordionFieldA11yProps {
  const a11y: AccordionFieldA11yProps = { ariaLabelledBy: args.labelId }
  if (args.describedBy) a11y.ariaDescribedBy = args.describedBy
  if (args.invalid) a11y.ariaInvalid = true
  return a11y
}
