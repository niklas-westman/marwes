/** Representative render inputs only; this does not declare official SSR support. */
export const hydrationSmokeComponentNames = [
  "MarwesProvider",
  "Button",
  "IconButton",
  "DestructiveButton",
  "CreateButton",
  "SubmitButton",
  "CancelButton",
  "LinkButton",
  "SaveButton",
  "ConfirmButton",
  "VerifyButton",
  "EditButton",
  "CloseButton",
  "RefreshButton",
  "UploadButton",
  "DownloadButton",
  "CopyButton",
  "SearchButton",
  "FilterButton",
  "SortButton",
  "DropdownButton",
  "PrimaryButton",
  "SecondaryButton",
  "TextButton",
  "SuccessButton",
  "InputField",
  "InputOtpField",
  "SelectField",
  "TextareaField",
  "RichTextField",
  "DropdownField",
  "SearchField",
  "PasswordField",
  "EmailField",
  "DateOfBirthField",
  "ZipCodeField",
  "PhoneField",
  "URLField",
  "CurrencyField",
  "Icon",
  "Avatar",
  "AvatarBadge",
  "AvatarGroup",
  "ProfileAvatar",
  "PresenceAvatar",
  "TeamAvatarGroup",
  "Divider",
  "ContextMenu",
  "Breadcrumb",
  "Spinner",
  "ButtonSpinner",
  "EmptyStateSpinner",
  "Skeleton",
  "ProgressBar",
  "Spacer",
  "Spacing",
  "Stack",
  "StackItem",
  "H1",
  "H2",
  "H3",
  "Paragraph",
  "Text",
  "TypographyText",
  "StatTile",
  "DatePickerField",
  "Drawer",
  "Card",
  "ProductCard",
  "ProfileCard",
  "StatCard",
  "Toast",
  "ToastContainer",
  "ToastProvider",
  "SuccessToast",
  "ErrorToast",
  "WarningToast",
  "InfoToast",
  "Tooltip",
  "TooltipGroup",
  "AccordionField",
  "FAQAccordion",
  "SettingsAccordion",
  "SectionsAccordion",
  "RadioGroupField",
  "YesNoRadioGroup",
  "RatingRadioGroup",
  "OptionRadioGroup",
  "Badge",
  "BadgeGroup",
  "StatusBadge",
  "PriorityBadge",
  "NotificationBadge",
  "Banner",
  "InfoBanner",
  "SuccessBanner",
  "WarningBanner",
  "ErrorBanner",
  "SwitchField",
  "FeatureToggle",
  "PreferenceSwitch",
  "PermissionSwitch",
  "SliderField",
  "VolumeSlider",
  "BrightnessSlider",
  "RadiusSlider",
  "Tab",
  "TabGroup",
  "TabPanel",
  "NavigationTabs",
  "ContentTabs",
  "SettingsTabs",
  "SegmentedControlField",
  "PaginationField",
  "SkipLink",
  "Dialog",
  "DialogModal",
  "ConfirmDialog",
  "DestructiveDialog",
  "InfoDialog",
  "CheckboxField",
  "CheckboxGroupField",
] as const

export type HydrationSmokeComponentName = (typeof hydrationSmokeComponentNames)[number]

const options = [
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
]
const tabs = [
  { value: "first", label: "First", panel: "First panel" },
  { value: "second", label: "Second", panel: "Second panel" },
]
const accordionItems = [
  { value: "first", title: "First", content: "First section" },
  { value: "second", title: "Second", content: "Second section" },
]

export function hydrationSmokeProps(name: HydrationSmokeComponentName): Record<string, unknown> {
  switch (name) {
    case "InputField":
      return { label: "Contact", input: { value: "Server contact" } }
    case "TextareaField":
      return { label: "Notes", textarea: { value: "Server notes" } }
    case "InputOtpField":
      return { label: "Code", inputOtp: { value: "123456" } }
    case "RichTextField":
      return { label: "Notes", editor: { value: "Server notes" } }
    case "SelectField":
    case "DropdownField":
      return { label: "Country", select: { options, value: "no", name: "country" } }
    case "SearchField":
      return { label: "Search", input: { value: "Server query" } }
    case "PasswordField":
      return { label: "Password", input: { value: "Server password" } }
    case "EmailField":
      return { label: "Email", input: { value: "user@example.com" } }
    case "DateOfBirthField":
      return { label: "Birthday", input: { value: "2000-01-02" } }
    case "ZipCodeField":
      return { label: "Postal code", input: { value: "01234" } }
    case "PhoneField":
      return { label: "Phone", input: { value: "+46123456789" } }
    case "URLField":
      return { label: "Website", input: { value: "https://example.com" } }
    case "CurrencyField":
      return { label: "Amount", input: { value: "42" } }
    case "CheckboxField":
      return { label: "Accept", checkbox: { checked: true }, checked: true }
    case "CheckboxGroupField":
      return { label: "Countries", options, value: ["no"] }
    case "RadioGroupField":
    case "OptionRadioGroup":
      return { label: "Country", name: "country", options, value: "no" }
    case "YesNoRadioGroup":
      return { label: "Accept", name: "accept", value: "yes" }
    case "RatingRadioGroup":
      return { label: "Rating", name: "rating", value: "3" }
    case "SwitchField":
    case "FeatureToggle":
    case "PreferenceSwitch":
    case "PermissionSwitch":
      return { label: "Notifications", switch: { checked: true } }
    case "SliderField":
    case "VolumeSlider":
    case "BrightnessSlider":
    case "RadiusSlider":
      return { label: "Level", slider: { value: 42 } }
    case "SegmentedControlField":
      return { label: "Country", segmentedControl: { items: options, value: "no" } }
    case "PaginationField":
      return { label: "Pages", pagination: { pageCount: 10, page: 4 } }
    case "DatePickerField":
      return { label: "Date", datePicker: { monthLabel: "October 2026" } }
    case "AccordionField":
    case "FAQAccordion":
    case "SettingsAccordion":
    case "SectionsAccordion":
      return { label: "Sections", items: accordionItems, openItems: ["second"] }
    case "TabGroup":
    case "NavigationTabs":
    case "ContentTabs":
    case "SettingsTabs":
      return { label: "Sections", tabs, activeTab: "second" }
    case "Tab":
      return { label: "Tab", active: true }
    case "TabPanel":
      return { id: "smoke-panel", tabId: "smoke-tab" }
    case "Avatar":
    case "ProfileAvatar":
      return { alt: "Contact", initials: "NW" }
    case "AvatarBadge":
    case "PresenceAvatar":
      return { alt: "Contact", initials: "NW" }
    case "AvatarGroup":
    case "TeamAvatarGroup":
      return { items: [{ initials: "NW", alt: "Contact" }] }
    case "Breadcrumb":
      return { items: [{ label: "Home", href: "/" }, { label: "Current" }] }
    case "Icon":
    case "IconButton":
      return { name: "check", ariaLabel: "Confirm" }
    case "TooltipGroup":
      return { content: "Help", triggerLabel: "Help", open: false }
    case "ContextMenu":
      return {
        label: "Actions",
        items: [{ type: "action", label: "Edit", value: "edit" }],
        open: false,
      }
    case "Drawer":
    case "Dialog":
    case "DialogModal":
    case "ConfirmDialog":
    case "DestructiveDialog":
    case "InfoDialog":
      return { open: false, title: "Details" }
    case "ProgressBar":
      return { value: 42, ariaLabel: "Progress" }
    case "StatTile":
      return { label: "Total", value: "42" }
    case "BadgeGroup":
      return { label: "Statuses" }
    case "Spacing":
    case "Spacer":
      return { size: "md" }
    case "ToastContainer":
      return { toasts: [] }
    default:
      return {}
  }
}

export function isPublicComponentExport(name: string, value: unknown): boolean {
  if (!/^[A-Z]/.test(name)) return false
  if (typeof value === "function") return true
  return (
    typeof value === "object" &&
    value !== null &&
    ("setup" in value || "render" in value || "$$typeof" in value)
  )
}
