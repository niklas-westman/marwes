import { iconNames } from "../components/atoms"

export const storybookLayout = {
  centered: { layout: "centered" },
  padded: { layout: "padded" },
  fullscreen: { layout: "fullscreen" },
} as const

export const storybookIconNames = [...iconNames]
export const storybookOptionalIconNames = [undefined, ...storybookIconNames]

export const storybookButtonIconArgTypes = {
  iconLeft: {
    control: "select",
    options: storybookOptionalIconNames,
  },
  iconRight: {
    control: "select",
    options: storybookOptionalIconNames,
  },
  disabled: {
    control: "boolean",
  },
} as const

export const storybookButtonGeneralArgTypes = {
  ...storybookButtonIconArgTypes,
} as const

export const storybookButtonPurposeArgTypes = {
  variant: {
    control: "select",
    options: ["primary", "secondary", "text"],
  },
  ...storybookButtonIconArgTypes,
} as const

export const storybookCheckboxArgTypes = {
  size: { control: "radio", options: ["sm", "md", "lg"] },
  disabled: { control: "boolean" },
  required: { control: "boolean" },
  invalid: { control: "boolean" },
  checked: { control: "boolean" },
  defaultChecked: { control: "boolean" },
  indeterminate: { control: "boolean" },
  ariaLabel: { control: "text" },
} as const

export const storybookDividerArgTypes = {
  size: {
    control: "select",
    options: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"],
    description: "Size variant (xxs=1px, xs=8px, sm=16px, md=32px, lg=48px, xl=64px, xxl=80px)",
  },
  orientation: {
    control: "select",
    options: ["horizontal", "vertical"],
    description: "Orientation of the divider",
  },
} as const

export const storybookIconGalleryDefaults = {
  size: "sm",
  strokeWidth: "md",
  search: "",
  columns: 8,
} as const

export const storybookIconGalleryArgTypes = {
  size: {
    control: "inline-radio",
    options: ["xs", "sm", "md", "lg"],
  },
  strokeWidth: {
    control: "inline-radio",
    options: ["xs", "sm", "md", "lg"],
  },
  search: { control: "text" },
  columns: {
    control: { type: "range", min: 4, max: 14, step: 1 },
  },
} as const

export const storybookDocsDescription = {
  linkButton: "LinkButton renders as an anchor tag with button styling and navigation metadata.",
  dangerButton:
    "DangerButton automatically sets destructive metadata and requires confirmation by default.",
  submitButton: "SubmitButton automatically sets type='submit' and form-related metadata.",
  colors:
    "Complete color palette from Figma design system. All colors are semantic tokens that map to CSS variables for theming.",
} as const
