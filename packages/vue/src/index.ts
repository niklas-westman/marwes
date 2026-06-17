import "@marwes-ui/presets/firstEdition/styles.css"

export { MarwesProvider } from "./provider/marwes-provider"
export type { MarwesProviderProps, MarwesProviderSlotProps } from "./provider/marwes-provider"
export { useTheme } from "./provider/use-theme"
export { useThemeMode } from "./provider/use-theme-mode"
export type { ThemeModeContextValue } from "./provider/use-theme-mode"
export { createMarwesThemeScript, createMarwesThemeStyle } from "./ssr"
export type { MarwesThemeScriptOptions, MarwesThemeStyleOptions } from "./ssr"
export {
  createFontStack,
  mwAvailableFonts,
  mwFontFallbacks,
  mwGoogleFontFamilies,
  mwStyledTheme,
  mwTheme,
  mwThemeVarNames,
  mwThemeVars,
  mwVar,
  createMwTheme,
  createMwThemeMedia,
  TextVariant,
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
  MwTheme,
  MwThemeMedia,
  MwThemeVarName,
  MwThemeVarNames,
  MwThemeVarReference,
  MwThemeVars,
  ResolvedTheme,
  Theme,
  ThemeBreakpointName,
  ThemeBreakpoints,
  ThemeInput,
  ThemeModeAttribute,
  ThemeModeRootTarget,
  ThemePreference,
  ThemeVariableStrategy,
} from "@marwes-ui/core"
export type { ToneName } from "@marwes-ui/core"

/* Button */
export {
  Button,
  IconButton,
  DestructiveButton,
  CreateButton,
  SubmitButton,
  CancelButton,
  LinkButton,
  SaveButton,
  ConfirmButton,
  VerifyButton,
  EditButton,
  CloseButton,
  RefreshButton,
  UploadButton,
  DownloadButton,
  CopyButton,
  SearchButton,
  FilterButton,
  SortButton,
  DropdownButton,
  PrimaryButton,
  SecondaryButton,
  TextButton,
  SuccessButton,
} from "./components/button"
export type {
  ButtonProps,
  IconButtonProps,
  DestructiveButtonProps,
  CreateButtonProps,
  SubmitButtonProps,
  CancelButtonProps,
  LinkButtonProps,
  SaveButtonProps,
  ConfirmButtonProps,
  VerifyButtonProps,
  EditButtonProps,
  CloseButtonProps,
  RefreshButtonProps,
  UploadButtonProps,
  DownloadButtonProps,
  CopyButtonProps,
  SearchButtonProps,
  FilterButtonProps,
  SortButtonProps,
  DropdownButtonProps,
  PrimaryButtonProps,
  SecondaryButtonProps,
  TextButtonProps,
  SuccessButtonProps,
} from "./components/button"
export { ButtonAction, ButtonSize, ButtonVariant } from "@marwes-ui/core"

/* Input */
// `Input`, `RichText`, `Textarea`, `Select` atoms intentionally NOT exported —
// use `InputField` / `RichTextField` / `TextareaField` / `SelectField`
// (or a purpose variant like `DropdownField`, `EmailField`, `PhoneField`, etc.).
export {
  InputField,
  InputOtp,
  SelectField,
  TextareaField,
  RichTextField,
  DropdownField,
  SearchField,
  PasswordField,
  EmailField,
  DateOfBirthField,
  ZipCodeField,
  PhoneField,
  URLField,
  CurrencyField,
} from "./components/input"
export type {
  SelectAppearance,
  SelectOption,
  InputFieldProps,
  InputOtpProps,
  SelectFieldProps,
  SelectFieldVariant,
  TextareaFieldProps,
  RichTextFieldProps,
  DropdownFieldProps,
  SearchFieldProps,
  PasswordFieldProps,
  EmailFieldProps,
  DateOfBirthFieldProps,
  ZipCodeFieldProps,
  PhoneFieldProps,
  URLFieldProps,
  CurrencyFieldProps,
} from "./components/input"

/* Icon */
export { Icon } from "./components/icon"
export type { IconProps } from "./components/icon"
export { IconName } from "@marwes-ui/core"

/* Avatar */
export {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  ProfileAvatar,
  PresenceAvatar,
  TeamAvatarGroup,
} from "./components/avatar"
export type {
  AvatarProps,
  AvatarBadgeProps,
  AvatarGroupItem,
  AvatarGroupProps,
  ProfileAvatarProps,
  PresenceAvatarProps,
  TeamAvatarGroupProps,
} from "./components/avatar"
export { AvatarSize, AvatarType } from "@marwes-ui/core"

/* Checkbox */
// The `Checkbox` atom is intentionally NOT exported from the public entry —
// use `CheckboxField` or `CheckboxGroupField` instead.
export { CheckboxField, CheckboxGroupField } from "./components/checkbox"
export type {
  CheckboxFieldProps,
  CheckboxGroupFieldProps,
  CheckboxGroupFieldOption,
} from "./components/checkbox"

/* Divider */
export { Divider } from "./components/divider"
export type { DividerProps } from "./components/divider"

/* ContextMenu */
export { ContextMenu } from "./components/context-menu"
export type { ContextMenuProps } from "./components/context-menu"
export type {
  ContextMenuActionItem,
  ContextMenuDividerItem,
  ContextMenuEntry,
} from "@marwes-ui/core"

/* Breadcrumb */
export { Breadcrumb } from "./components/breadcrumb"
export type { BreadcrumbProps } from "./components/breadcrumb"
export type { BreadcrumbItem } from "@marwes-ui/core"

/* Spinner */
export { Spinner, ButtonSpinner, EmptyStateSpinner } from "./components/spinner"
export type {
  SpinnerProps,
  ButtonSpinnerProps,
  EmptyStateSpinnerProps,
} from "./components/spinner"

/* Skeleton */
export { Skeleton } from "./components/skeleton"
export type { SkeletonProps } from "./components/skeleton"

/* ProgressBar */
export { ProgressBar } from "./components/progress-bar"
export type { ProgressBarProps } from "./components/progress-bar"

/* Spacing */
export { Spacer, Spacing } from "./components/spacing"
export type { SpacerProps, SpacingProps } from "./components/spacing"
export { Spacings } from "@marwes-ui/core"
export type { SpacingSize } from "@marwes-ui/core"

/* Heading */
export { H1, H2, H3, createHeadingComponent } from "./components/heading"
export type { HeadingProps, HeadingLevel } from "./components/heading"

/* Paragraph */
export { Paragraph } from "./components/paragraph"
export type { ParagraphProps } from "./components/paragraph"

/* Text */
export { Text, TypographyText } from "./components/text"
export type { TextComponent, TextProps } from "./components/text"
export type { TextAs } from "@marwes-ui/core"

/* StatTile */
export { StatTile } from "./components/stat-tile"
export type { StatTileProps } from "./components/stat-tile"

/* DatePicker */
// The `DatePicker` atom is intentionally NOT exported from the public entry —
// use `DatePickerField` instead.
export { DatePickerField } from "./components/date-picker"
export type { DatePickerFieldProps } from "./components/date-picker"

/* Drawer */
export { Drawer } from "./components/drawer"
export type { DrawerPlacement, DrawerProps, DrawerSize } from "./components/drawer"

/* Card */
export { Card, ProductCard, ProfileCard, StatCard } from "./components/card"
export type {
  CardProps,
  ProductCardProps,
  ProfileCardProps,
  StatCardProps,
} from "./components/card"

/* Toast */
export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
  SuccessToast,
  ErrorToast,
  WarningToast,
  InfoToast,
} from "./components/toast"
export type {
  ToastProps,
  ManagedToast,
  ShowToastOptions,
  ToastContainerProps,
  ToastController,
  ToastProviderProps,
  SuccessToastProps,
  ErrorToastProps,
  WarningToastProps,
  InfoToastProps,
} from "./components/toast"

/* Tooltip */
export { Tooltip, TooltipGroup } from "./components/tooltip"
export type { TooltipProps, TooltipGroupProps } from "./components/tooltip"

/* Accordion */
// The `Accordion` atom (single collapsible panel) is intentionally NOT exported —
// use `AccordionField` (groups) or a purpose variant.

/* AccordionField */
export { AccordionField } from "./components/accordion"
export type { AccordionFieldProps, AccordionFieldItem } from "./components/accordion"

/* Accordion Variants */
export { FAQAccordion, SettingsAccordion, SectionsAccordion } from "./components/accordion"
export type {
  FAQAccordionProps,
  SettingsAccordionProps,
  SectionsAccordionProps,
} from "./components/accordion"

/* Radio */
// The `Radio` atom is intentionally NOT exported from the public entry —
// use `RadioGroupField` (or a purpose variant) instead.
export {
  RadioGroupField,
  YesNoRadioGroup,
  RatingRadioGroup,
  OptionRadioGroup,
} from "./components/radio"
export type {
  RadioGroupFieldProps,
  RadioGroupFieldOption,
  YesNoRadioGroupProps,
  RatingRadioGroupProps,
  OptionRadioGroupProps,
} from "./components/radio"

/* Badge */
export { Badge } from "./components/badge"
export type { BadgeProps } from "./components/badge"
export { BadgeVariant } from "@marwes-ui/core"

/* BadgeGroup */
export { BadgeGroup } from "./components/badge"
export type { BadgeGroupProps } from "./components/badge"

/* Badge Variants */
export { StatusBadge, PriorityBadge, NotificationBadge } from "./components/badge"
export type {
  StatusBadgeProps,
  PriorityBadgeProps,
  NotificationBadgeProps,
} from "./components/badge"

/* Banner */
export { Banner, InfoBanner, SuccessBanner, WarningBanner, ErrorBanner } from "./components/banner"
export type {
  BannerProps,
  InfoBannerProps,
  SuccessBannerProps,
  WarningBannerProps,
  ErrorBannerProps,
} from "./components/banner"
export { BannerVariant } from "@marwes-ui/core"

/* Switch */
// The `Switch` atom is intentionally NOT exported from the public entry —
// use `SwitchField` (or a purpose variant) instead.
export {
  SwitchField,
  FeatureToggle,
  PreferenceSwitch,
  PermissionSwitch,
} from "./components/switch"
export type {
  SwitchFieldProps,
  FeatureToggleProps,
  PreferenceSwitchProps,
  PermissionSwitchProps,
} from "./components/switch"
export { SwitchSize } from "@marwes-ui/core"

/* Slider */
// The `Slider` atom is intentionally NOT exported from the public entry —
// use `SliderField` (or a purpose variant) instead.
export {
  SliderField,
  VolumeSlider,
  BrightnessSlider,
  RadiusSlider,
} from "./components/slider"
export type {
  SliderFieldProps,
  VolumeSliderProps,
  BrightnessSliderProps,
  RadiusSliderProps,
} from "./components/slider"

/* Tab */
export {
  Tab,
  TabGroup,
  TabPanel,
  NavigationTabs,
  ContentTabs,
  SettingsTabs,
} from "./components/tab"
export type {
  TabProps,
  TabGroupItem,
  TabGroupProps,
  TabPanelProps,
  NavigationTabsProps,
  ContentTabsProps,
  SettingsTabsProps,
} from "./components/tab"

/* Segmented Control */
export { SegmentedControl } from "./components/segmented-control"
export type { SegmentedControlProps, SegmentedControlItem } from "./components/segmented-control"

/* Pagination */
export { Pagination, PaginationField } from "./components/pagination"
export type { PaginationProps, PaginationFieldProps } from "./components/pagination"

/* SkipLink */
export { SkipLink } from "./components/skip-link"
export type { SkipLinkProps } from "./components/skip-link"

/* Dialog */
export {
  Dialog,
  DialogModal,
  ConfirmDialog,
  DestructiveDialog,
  InfoDialog,
} from "./components/dialog"
export type {
  DialogProps,
  DialogFooterControls,
  DialogModalProps,
  ConfirmDialogProps,
  DestructiveDialogProps,
  InfoDialogProps,
} from "./components/dialog"
