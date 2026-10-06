import type {
  AccordionA11yProps,
  AccordionFieldA11yProps,
  AccordionOptions,
  AccordionPanelA11yProps,
  AccordionTriggerA11yProps,
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

export function resolveAccordionPartsA11y(opts: AccordionOptions): {
  trigger: AccordionTriggerA11yProps
  panel: AccordionPanelA11yProps
} {
  const { triggerId, panelId, ariaExpanded, ariaDisabled } = resolveAccordionA11y(opts)

  const trigger: AccordionTriggerA11yProps = {
    id: triggerId,
    ariaExpanded,
    ariaControls: panelId,
  }
  if (ariaDisabled) trigger.ariaDisabled = true

  return { trigger, panel: { id: panelId, role: "region", ariaLabelledBy: triggerId } }
}
