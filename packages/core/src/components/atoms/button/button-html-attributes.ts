import type { ButtonA11yProps } from "./button-types"

// Exhaustive on purpose: adding a ButtonA11yProps field fails to compile until it is mapped
// here, so no adapter can silently drop a new accessibility attribute.
const HTML_ATTRIBUTE_NAME_BY_A11Y_FIELD = {
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaBusy: "aria-busy",
  ariaDisabled: "aria-disabled",
  ariaPressed: "aria-pressed",
  ariaExpanded: "aria-expanded",
  ariaControls: "aria-controls",
  title: "title",
  disabled: "disabled",
  type: "type",
  href: "href",
  role: "role",
  tabIndex: "tabindex",
} as const satisfies Record<keyof ButtonA11yProps, string>

type HtmlAttributeNameByA11yField = typeof HTML_ATTRIBUTE_NAME_BY_A11Y_FIELD

export type ButtonHtmlAttributes = {
  -readonly [Field in keyof ButtonA11yProps as HtmlAttributeNameByA11yField[Field]]?: ButtonA11yProps[Field]
}

/**
 * Translates resolved button a11y fields into HTML attribute names (lowercase `tabindex`).
 * Fields that are undefined are omitted. Frameworks that need another casing rename on spread.
 */
export function toButtonHtmlAttributes(a11y: ButtonA11yProps): ButtonHtmlAttributes {
  const attributes: Record<string, unknown> = {}

  for (const field of Object.keys(HTML_ATTRIBUTE_NAME_BY_A11Y_FIELD) as Array<
    keyof ButtonA11yProps
  >) {
    const value = a11y[field]
    if (value !== undefined) attributes[HTML_ATTRIBUTE_NAME_BY_A11Y_FIELD[field]] = value
  }

  return attributes as ButtonHtmlAttributes
}
