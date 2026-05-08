// @marwes-ui/svelte — main public API
// CSS is NOT imported here. Users import from @marwes-ui/presets explicitly.

// Provider
export { default as MarwesProvider } from "./provider/MarwesProvider.svelte"
export type {
  MarwesProviderProps,
  MarwesContextState,
  MarwesContextValue,
} from "./provider/types.js"
export { useTheme } from "./provider/use-theme.js"
export type { UseThemeReturn } from "./provider/use-theme.js"
export { useThemeMode } from "./provider/use-theme-mode.js"
export type { ThemeModeContextValue } from "./provider/use-theme-mode.js"

// SSR
export { createMarwesThemeScript, createMarwesThemeStyle } from "./ssr.js"
export type { MarwesThemeScriptOptions, MarwesThemeStyleOptions } from "./ssr.js"

// Button
export { default as Button } from "./components/button/Button.svelte"
export { default as PrimaryButton } from "./components/button/PrimaryButton.svelte"
export { default as SecondaryButton } from "./components/button/SecondaryButton.svelte"
export { default as TextButton } from "./components/button/TextButton.svelte"
export { default as SuccessButton } from "./components/button/SuccessButton.svelte"
export { default as DestructiveButton } from "./components/button/DestructiveButton.svelte"
export { default as SubmitButton } from "./components/button/SubmitButton.svelte"
export { default as CancelButton } from "./components/button/CancelButton.svelte"
export { default as CreateButton } from "./components/button/CreateButton.svelte"
export { default as LinkButton } from "./components/button/LinkButton.svelte"
export { default as SaveButton } from "./components/button/SaveButton.svelte"
export { default as ConfirmButton } from "./components/button/ConfirmButton.svelte"
export { default as VerifyButton } from "./components/button/VerifyButton.svelte"
export { default as EditButton } from "./components/button/EditButton.svelte"
export { default as CloseButton } from "./components/button/CloseButton.svelte"
export { default as RefreshButton } from "./components/button/RefreshButton.svelte"
export { default as UploadButton } from "./components/button/UploadButton.svelte"
export { default as DownloadButton } from "./components/button/DownloadButton.svelte"
export { default as CopyButton } from "./components/button/CopyButton.svelte"
export { default as SearchButton } from "./components/button/SearchButton.svelte"
export { default as FilterButton } from "./components/button/FilterButton.svelte"
export { default as SortButton } from "./components/button/SortButton.svelte"
export { default as DropdownButton } from "./components/button/DropdownButton.svelte"
export type { ButtonProps } from "./components/button/types.js"

// Icon
export { default as Icon } from "./components/icon/Icon.svelte"
export type { IconProps } from "./components/icon/types.js"

// Spinner
export { default as Spinner } from "./components/spinner/Spinner.svelte"
export { default as ButtonSpinner } from "./components/spinner/ButtonSpinner.svelte"
export { default as EmptyStateSpinner } from "./components/spinner/EmptyStateSpinner.svelte"
export type { SpinnerProps, ButtonSpinnerProps } from "./components/spinner/types.js"

// Input
export { default as Input } from "./components/input/Input.svelte"
export { default as InputField } from "./components/input/InputField.svelte"
export { default as PasswordField } from "./components/input/PasswordField.svelte"
export { default as EmailField } from "./components/input/EmailField.svelte"
export { default as SearchField } from "./components/input/SearchField.svelte"
export { default as PhoneField } from "./components/input/PhoneField.svelte"
export { default as URLField } from "./components/input/URLField.svelte"
export { default as CurrencyField } from "./components/input/CurrencyField.svelte"
export { default as DateOfBirthField } from "./components/input/DateOfBirthField.svelte"
export { default as ZipCodeField } from "./components/input/ZipCodeField.svelte"
export { default as DropdownField } from "./components/input/DropdownField.svelte"
export { default as InputOtp } from "./components/input/InputOtp.svelte"
export type { InputProps, InputFieldProps } from "./components/input/types.js"

// Badge
export { default as Badge } from "./components/badge/Badge.svelte"
export { default as BadgeGroup } from "./components/badge/BadgeGroup.svelte"
export { default as StatusBadge } from "./components/badge/StatusBadge.svelte"
export { default as PriorityBadge } from "./components/badge/PriorityBadge.svelte"
export { default as NotificationBadge } from "./components/badge/NotificationBadge.svelte"
export type { BadgeProps, BadgeGroupProps } from "./components/badge/types.js"

// Card
export { default as Card } from "./components/card/Card.svelte"
export { default as ProductCard } from "./components/card/ProductCard.svelte"
export { default as ProfileCard } from "./components/card/ProfileCard.svelte"
export { default as StatCard } from "./components/card/StatCard.svelte"
export type { CardProps } from "./components/card/types.js"

// Divider
export { default as Divider } from "./components/divider/Divider.svelte"
export type { DividerProps } from "./components/divider/types.js"

// Spacing
export { default as Spacing } from "./components/spacing/Spacing.svelte"
export { default as Spacer } from "./components/spacing/Spacer.svelte"
export type { SpacingProps, SpacerProps } from "./components/spacing/types.js"

// Typography
export { default as H1 } from "./components/typography/H1.svelte"
export { default as H2 } from "./components/typography/H2.svelte"
export { default as H3 } from "./components/typography/H3.svelte"
export { default as Paragraph } from "./components/typography/Paragraph.svelte"
export type { H1Props, H2Props, H3Props, ParagraphProps } from "./components/typography/types.js"

// Textarea
export { default as Textarea } from "./components/textarea/Textarea.svelte"
export { default as TextareaField } from "./components/textarea/TextareaField.svelte"
export type { TextareaProps } from "./components/textarea/types.js"

// Select
export { default as Select } from "./components/select/Select.svelte"
export { default as SelectField } from "./components/select/SelectField.svelte"
export type { SelectProps } from "./components/select/types.js"

// Checkbox
export { default as Checkbox } from "./components/checkbox/Checkbox.svelte"
export { default as CheckboxField } from "./components/checkbox/CheckboxField.svelte"
export { default as CheckboxGroupField } from "./components/checkbox/CheckboxGroupField.svelte"
export type { CheckboxProps } from "./components/checkbox/types.js"

// Switch
export { default as Switch } from "./components/switch/Switch.svelte"
export { default as SwitchField } from "./components/switch/SwitchField.svelte"
export { default as FeatureToggle } from "./components/switch/FeatureToggle.svelte"
export { default as PreferenceSwitch } from "./components/switch/PreferenceSwitch.svelte"
export { default as PermissionSwitch } from "./components/switch/PermissionSwitch.svelte"
export type { SwitchProps } from "./components/switch/types.js"

// Radio
export { default as Radio } from "./components/radio/Radio.svelte"
export { default as RadioGroupField } from "./components/radio/RadioGroupField.svelte"
export { default as OptionRadioGroup } from "./components/radio/OptionRadioGroup.svelte"
export { default as YesNoRadioGroup } from "./components/radio/YesNoRadioGroup.svelte"
export { default as RatingRadioGroup } from "./components/radio/RatingRadioGroup.svelte"
export type { RadioProps } from "./components/radio/types.js"

// Avatar
export { default as Avatar } from "./components/avatar/Avatar.svelte"
export { default as AvatarBadge } from "./components/avatar/AvatarBadge.svelte"
export { default as AvatarGroup } from "./components/avatar/AvatarGroup.svelte"
export { default as ProfileAvatar } from "./components/avatar/ProfileAvatar.svelte"
export { default as PresenceAvatar } from "./components/avatar/PresenceAvatar.svelte"
export { default as TeamAvatarGroup } from "./components/avatar/TeamAvatarGroup.svelte"
export type { AvatarProps } from "./components/avatar/types.js"

// Skeleton
export { default as Skeleton } from "./components/skeleton/Skeleton.svelte"
export type { SkeletonProps } from "./components/skeleton/types.js"

// StatTile
export { default as StatTile } from "./components/stat-tile/StatTile.svelte"
export type { StatTileProps } from "./components/stat-tile/types.js"

// Tooltip
export { default as Tooltip } from "./components/tooltip/Tooltip.svelte"
export { default as TooltipGroup } from "./components/tooltip/TooltipGroup.svelte"
export type { TooltipProps, TooltipGroupProps } from "./components/tooltip/types.js"

// Toast
export { default as Toast } from "./components/toast/Toast.svelte"
export { default as ToastContainer } from "./components/toast/ToastContainer.svelte"
export { default as ToastProvider } from "./components/toast/ToastProvider.svelte"
export { useToast } from "./components/toast/ToastProvider.svelte"
export { default as SuccessToast } from "./components/toast/SuccessToast.svelte"
export { default as ErrorToast } from "./components/toast/ErrorToast.svelte"
export { default as WarningToast } from "./components/toast/WarningToast.svelte"
export { default as InfoToast } from "./components/toast/InfoToast.svelte"
export type {
  ToastProps,
  ToastContainerProps,
  ToastProviderProps,
  ToastController,
  ManagedToast,
  ShowToastOptions,
} from "./components/toast/types.js"

// Dialog
export { default as Dialog } from "./components/dialog/Dialog.svelte"
export { default as DialogModal } from "./components/dialog/DialogModal.svelte"
export { default as ConfirmDialog } from "./components/dialog/ConfirmDialog.svelte"
export { default as DestructiveDialog } from "./components/dialog/DestructiveDialog.svelte"
export { default as InfoDialog } from "./components/dialog/InfoDialog.svelte"
export type {
  DialogProps,
  DialogModalProps,
  ConfirmDialogProps,
  DestructiveDialogProps,
  InfoDialogProps,
} from "./components/dialog/types.js"

// Accordion
export { default as Accordion } from "./components/accordion/Accordion.svelte"
export { default as AccordionField } from "./components/accordion/AccordionField.svelte"
export { default as FAQAccordion } from "./components/accordion/FAQAccordion.svelte"
export { default as SettingsAccordion } from "./components/accordion/SettingsAccordion.svelte"
export { default as SectionsAccordion } from "./components/accordion/SectionsAccordion.svelte"
export type { AccordionProps } from "./components/accordion/types.js"

// TabGroup
export { default as TabGroup } from "./components/tab/TabGroup.svelte"
export { default as NavigationTabs } from "./components/tab/NavigationTabs.svelte"
export { default as ContentTabs } from "./components/tab/ContentTabs.svelte"
export { default as SettingsTabs } from "./components/tab/SettingsTabs.svelte"
export type { TabGroupProps, TabGroupItem } from "./components/tab/types.js"

// Slider
export { default as Slider } from "./components/slider/Slider.svelte"
export { default as SliderField } from "./components/slider/SliderField.svelte"
export { default as VolumeSlider } from "./components/slider/VolumeSlider.svelte"
export { default as BrightnessSlider } from "./components/slider/BrightnessSlider.svelte"
export { default as RadiusSlider } from "./components/slider/RadiusSlider.svelte"
export type { SliderProps } from "./components/slider/types.js"

// Core re-exports
export {
  BadgeVariant,
  ButtonAction,
  ButtonSize,
  ButtonVariant,
  createFontStack,
  IconName,
  mwAvailableFonts,
  mwFontFallbacks,
  mwGoogleFontFamilies,
  mwStyledTheme,
  mwThemeVarNames,
  mwThemeVars,
  mwVar,
  Spacings,
  ThemeMode,
} from "@marwes-ui/core"

export type {
  Density,
  FontLoadingConfig,
  FontLoadingMode,
  FontLoadingOptions,
  MwAvailableFont,
  MwFontFallback,
  MwGoogleFontFamily,
  MwStyledTheme,
  MwThemeVarName,
  MwThemeVarNames,
  MwThemeVarReference,
  MwThemeVars,
  ResolvedTheme,
  SpacingSize,
  Theme,
  ThemeInput,
  ThemeModeAttribute,
  ThemeModeRootTarget,
  ThemePreference,
  ThemeVariableStrategy,
  ToneName,
} from "@marwes-ui/core"
