export type LabeledCopy = {
  label: string
  text: string
}

export type FieldComparisonRow = {
  field: string
  type: string
  inputMode: string
  autoComplete: string
  features: string
}

export const buttonWhySemanticComponents: LabeledCopy[] = [
  { label: "Guaranteed AI context", text: "action metadata is always set correctly" },
  { label: "Consistent UX", text: "enforces design patterns across your app" },
  { label: "Less boilerplate", text: "no need to remember which props to set" },
  { label: "Self-documenting", text: "code intent is clear from component name" },
]

export const buttonVariantVisualStyles: LabeledCopy[] = [
  { label: "primary", text: "Filled, high emphasis (main actions)" },
  { label: "secondary", text: "Outlined, medium emphasis (secondary actions)" },
  { label: "text", text: "Minimal, low emphasis (tertiary/inline actions)" },
]

export const buttonActionSemanticPurposes: LabeledCopy[] = [
  { label: "submit", text: "Form submission" },
  { label: "cancel", text: "Dismiss/cancel operation" },
  { label: "create", text: "Create new item" },
  { label: "delete", text: "Remove/destroy item" },
  { label: "navigate", text: "Go to another page" },
  { label: "edit", text: "Modify existing item" },
  { label: "reset", text: "Reset form state" },
  { label: "button", text: "Generic action (default)" },
]

export const fieldWhyPurposeComponents: LabeledCopy[] = [
  {
    label: "Automatic semantic attributes",
    text: "Correct type, inputMode, autoComplete set automatically",
  },
  { label: "Built-in functionality", text: "Password toggle, search clear button, etc. included" },
  { label: "Mobile-optimized", text: "Proper keyboard layouts on mobile devices" },
  { label: "AI-friendly", text: "data-purpose attributes for AI parsing and understanding" },
  { label: "Less boilerplate", text: "No need to remember which attributes to set" },
  { label: "Self-documenting", text: "Code intent is clear from component name" },
]

export const fieldComparisonRows: FieldComparisonRow[] = [
  {
    field: "SearchField",
    type: "search",
    inputMode: "search",
    autoComplete: "-",
    features: "Clear button (X icon) when has value",
  },
  {
    field: "PasswordField",
    type: "password",
    inputMode: "-",
    autoComplete: "current-password or new-password",
    features: "Show/hide toggle (eye icon)",
  },
  {
    field: "EmailField",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    features: "Email validation, @ keyboard",
  },
  {
    field: "PhoneField",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    features: "Phone keyboard, accepts any format",
  },
  {
    field: "URLField",
    type: "url",
    inputMode: "url",
    autoComplete: "url",
    features: "URL validation, .com keyboard",
  },
  {
    field: "CurrencyField",
    type: "text",
    inputMode: "decimal",
    autoComplete: "-",
    features: "Decimal keyboard, currency label",
  },
]

export const radioWhyContextVariants: LabeledCopy[] = [
  {
    label: "Pre-built options",
    text: "no need to manually create option lists for common patterns",
  },
  {
    label: "AI-friendly metadata",
    text: "data-purpose attributes are set automatically for AI parsing",
  },
  { label: "Consistent UX", text: "enforces accessible radio group patterns across your app" },
  { label: "Less boilerplate", text: "one component replaces a RadioGroupField + options array" },
  {
    label: "Self-documenting",
    text: "component name communicates intent (YesNoRadioGroup vs generic options)",
  },
]

export const radioContextVariantPurposes: LabeledCopy[] = [
  {
    label: "YesNoRadioGroup",
    text: "Binary yes/no choices — accept terms, opt in/out, enable/disable",
  },
  {
    label: "RatingRadioGroup",
    text: "Numeric scale selection — satisfaction ratings, priority levels, scores",
  },
  { label: "OptionRadioGroup", text: "General labeled options — preferences, categories, modes" },
]

export const accordionWhyContextVariants: LabeledCopy[] = [
  {
    label: "Pre-configured behaviour",
    text: "single-open or multi-open is set automatically based on the use case",
  },
  {
    label: "AI-friendly metadata",
    text: "data-purpose attributes are set automatically for AI parsing",
  },
  {
    label: "Consistent UX",
    text: "enforces accessible accordion group patterns across your app",
  },
  {
    label: "Less boilerplate",
    text: "one component replaces an AccordionField with preconfigured props",
  },
  {
    label: "Self-documenting",
    text: "component name communicates intent (FAQAccordion vs generic field)",
  },
]

export const accordionContextVariantPurposes: LabeledCopy[] = [
  {
    label: "FAQAccordion",
    text: 'Question-and-answer sections — single-open, data-purpose="faq"',
  },
  {
    label: "SettingsAccordion",
    text: 'Configuration panels — multi-open, data-purpose="settings"',
  },
  {
    label: "SectionsAccordion",
    text: 'Generic collapsible sections — flexible open mode, data-purpose="sections"',
  },
]
