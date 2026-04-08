import type { RichTextA11yProps, RichTextOptions } from "./rich-text-types"

export function resolveRichTextA11y(opts: RichTextOptions): RichTextA11yProps {
  const a11y: RichTextA11yProps = {
    role: "textbox",
    tabIndex: opts.disabled ? -1 : 0,
    ariaMultiline: true,
  }

  if (opts.id) a11y.id = opts.id
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.labelledBy) a11y.ariaLabelledBy = opts.labelledBy
  if (opts.describedBy) a11y.ariaDescribedBy = opts.describedBy
  if (opts.invalid) a11y.ariaInvalid = true
  if (opts.disabled) a11y.ariaDisabled = true
  if (opts.readOnly) a11y.ariaReadOnly = true
  if (opts.required) a11y.ariaRequired = true

  return a11y
}
