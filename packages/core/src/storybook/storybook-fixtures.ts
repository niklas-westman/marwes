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

export const storybookSpinnerArgTypes = {
  variant: {
    control: "select",
    options: ["classic", "ring", "dual", "dots-round", "dots-square", "lines", "cross"],
    description: "Visual style from the synced Spinner showcase",
  },
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
    description: "Token size (xs=16px, sm=24px, md=32px, lg=40px)",
  },
  decorative: {
    control: "boolean",
    description:
      "Hide the spinner from assistive technology when nearby text already communicates loading",
  },
  ariaLabel: {
    control: "text",
    description: "Accessible label for standalone loading indicators",
  },
} as const

export const storybookSpacingArgTypes = {
  size: {
    control: "select",
    options: [
      "xxxs",
      "xxs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "xxl",
      "xxxl",
      "4xl",
      "5xl",
      "6xl",
      "7xl",
      "8xl",
      "9xl",
      "10xl",
      "11xl",
    ],
    description: "Size variant (xxxs=2 … md=24 … 6xl=80 … 11xl=120px)",
  },
  scale: {
    control: { type: "number", min: 1, max: 8, step: 0.5 },
    description: "Multiplies the token value. scale=2 doubles any size.",
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

export const storybookRadioArgTypes = {
  checked: { control: "boolean" },
  defaultChecked: { control: "boolean" },
  disabled: { control: "boolean" },
  required: { control: "boolean" },
  invalid: { control: "boolean" },
  name: { control: "text" },
  value: { control: "text" },
  ariaLabel: { control: "text" },
} as const

export const storybookSliderArgTypes = {
  min: { control: { type: "number", min: -1000, max: 1000, step: 1 } },
  max: { control: { type: "number", min: -1000, max: 1000, step: 1 } },
  step: { control: { type: "number", min: 0.1, max: 100, step: 0.1 } },
  value: { control: { type: "number", min: -1000, max: 1000, step: 1 } },
  defaultValue: { control: { type: "number", min: -1000, max: 1000, step: 1 } },
  disabled: { control: "boolean" },
  required: { control: "boolean" },
  showTooltip: { control: "boolean" },
  showTouchArea: { control: "boolean" },
  ariaLabel: { control: "text" },
  ariaValueText: { control: "text" },
} as const

export const storybookDocsDescription = {
  linkButton:
    "LinkButton locks navigation semantics, renders as an anchor, and keeps the canonical text treatment. Use Button for intentional visual deviations.",
  destructiveButton:
    "DestructiveButton locks destructive semantics, uses the canonical primary + error treatment, and requires confirmation by default. Use Button for intentional exceptions.",
  submitButton:
    "SubmitButton locks form-submit semantics, always renders as a button, and keeps the canonical primary treatment.",
  saveButton:
    "SaveButton locks save semantics and the canonical primary treatment. Use Button if you need a different visual hierarchy.",
  confirmButton:
    "ConfirmButton locks affirmative confirmation semantics, always renders as a button, and keeps the canonical success treatment.",
  verifyButton:
    "VerifyButton locks verification semantics, always renders as a button, and keeps the canonical secondary treatment with a check-circle icon by default.",
  editButton:
    "EditButton locks edit semantics and the canonical secondary treatment with an edit icon by default.",
  uploadButton:
    "UploadButton locks upload semantics and the canonical secondary treatment with an upload icon by default.",
  downloadButton:
    "DownloadButton locks download semantics and the canonical secondary treatment with a download icon by default.",
  copyButton: "CopyButton locks copy semantics and the canonical neutral treatment.",
  searchButton:
    "SearchButton locks search semantics and the canonical primary treatment with a search icon by default.",
  filterButton: "FilterButton locks filter semantics and the canonical neutral treatment.",
  sortButton: "SortButton locks sort semantics and the canonical neutral treatment.",
  dropdownButton:
    "DropdownButton locks disclosure semantics and the canonical secondary treatment with a chevron-down icon by default.",
  closeButton: "CloseButton locks dismiss semantics and the canonical neutral treatment.",
  refreshButton:
    "RefreshButton locks refresh semantics and the canonical neutral treatment with a refresh icon by default.",
  colors:
    "Complete color palette from the design system. Semantic roles map to CSS variables, with label colors auto-derived by default and overrideable for brand-specific fills.",
} as const
