import type {
  RichTextA11yProps,
  RichTextFormat,
  RichTextOptions,
  RichTextToolbarButtonA11yProps,
} from "./rich-text-types"

export function resolveRichTextA11y(opts: RichTextOptions): RichTextA11yProps {
  const a11y: RichTextA11yProps = {
    role: "textbox",
    tabIndex: opts.disabled ? -1 : 0,
    ariaMultiline: true,
  }

  if (opts.id) a11y.id = opts.id
  const accessibleLabel = opts.ariaLabel ?? opts.label
  if (accessibleLabel) a11y.ariaLabel = accessibleLabel
  if (opts.labelledBy) a11y.ariaLabelledBy = opts.labelledBy
  if (opts.describedBy) a11y.ariaDescribedBy = opts.describedBy
  if (opts.invalid) a11y.ariaInvalid = true
  if (opts.disabled) a11y.ariaDisabled = true
  if (opts.readOnly) a11y.ariaReadOnly = true
  if (opts.required) a11y.ariaRequired = true

  return a11y
}

const DEFAULT_FORMAT_LABELS: Record<RichTextFormat, string> = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
}

export function resolveRichTextToolbarButtonA11y(args: {
  format: RichTextFormat
  active: boolean
  labels?: Partial<Record<RichTextFormat, string>> | undefined
}): RichTextToolbarButtonA11yProps {
  return {
    ariaLabel: args.labels?.[args.format] ?? DEFAULT_FORMAT_LABELS[args.format],
    ariaPressed: args.active,
  }
}
