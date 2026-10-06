import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  SelectComboboxA11yProps,
  SelectListboxA11yProps,
  SelectOptionA11yProps,
} from "./select-types"

const selectComboboxHtmlAttributeNames = {
  role: "role",
  ariaControls: "aria-controls",
  ariaExpanded: "aria-expanded",
  ariaHaspopup: "aria-haspopup",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaInvalid: "aria-invalid",
  ariaRequired: "aria-required",
  ariaActivedescendant: "aria-activedescendant",
} as const

export type SelectComboboxHtmlAttributes = HtmlAttributesOf<
  SelectComboboxA11yProps,
  typeof selectComboboxHtmlAttributeNames
>

/** Translates resolved custom-select trigger a11y fields into HTML attribute names. */
export const toSelectComboboxHtmlAttributes = defineHtmlAttributeMapper<SelectComboboxA11yProps>()(
  selectComboboxHtmlAttributeNames,
)

const selectListboxHtmlAttributeNames = {
  id: "id",
  role: "role",
  tabIndex: "tabindex",
} as const

export type SelectListboxHtmlAttributes = HtmlAttributesOf<
  SelectListboxA11yProps,
  typeof selectListboxHtmlAttributeNames
>

/** Translates resolved custom-select listbox a11y fields into HTML attribute names. */
export const toSelectListboxHtmlAttributes = defineHtmlAttributeMapper<SelectListboxA11yProps>()(
  selectListboxHtmlAttributeNames,
)

const selectOptionHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaSelected: "aria-selected",
  ariaDisabled: "aria-disabled",
  tabIndex: "tabindex",
} as const

export type SelectOptionHtmlAttributes = HtmlAttributesOf<
  SelectOptionA11yProps,
  typeof selectOptionHtmlAttributeNames
>

/** Translates resolved custom-select option a11y fields into HTML attribute names. */
export const toSelectOptionHtmlAttributes = defineHtmlAttributeMapper<SelectOptionA11yProps>()(
  selectOptionHtmlAttributeNames,
)
