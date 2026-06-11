import "@marwes-ui/presets/firstEdition/styles.css"

export { MarwesProvider } from "./provider/marwes-provider"
export type { MarwesProviderChildren, MarwesProviderProps } from "./provider/marwes-provider"
export { useTheme } from "./provider/use-theme"
export { useThemeMode } from "./provider/use-theme-mode"
export type { ThemeModeContextValue } from "./provider/use-theme-mode"
export {
  MarwesThemeScript,
  MarwesThemeStyle,
  createMarwesThemeScript,
  createMarwesThemeStyle,
} from "./ssr"
export type {
  MarwesThemeScriptOptions,
  MarwesThemeScriptProps,
  MarwesThemeStyleOptions,
  MarwesThemeStyleProps,
} from "./ssr"
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

// Re-export core types for good DX
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

// ======= ATOMS =======

/* Button */
export { Button, IconButton } from "./components/button"
export type { ButtonProps, IconButtonProps } from "./components/button"
export { ButtonAction, ButtonSize, ButtonVariant } from "@marwes-ui/core"
export {
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

/* Input */
export {
  Input,
  Select,
  Textarea,
  RichText,
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
  InputProps,
  SelectProps,
  SelectAppearance,
  SelectOption,
  TextareaProps,
  RichTextProps,
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
export { Checkbox } from "./components/checkbox"
export type { CheckboxProps } from "./components/checkbox"

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
export { H1, H2, H3 } from "./components/heading"
export type { H1Props, H2Props, H3Props } from "./components/heading"

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
export { DatePicker } from "./components/date-picker"
export type { DatePickerProps } from "./components/date-picker"

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
export { Accordion } from "./components/accordion"
export type { AccordionProps } from "./components/accordion"

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
export { Radio } from "./components/radio"
export type { RadioProps } from "./components/radio"

/* RadioGroupField */
export { RadioGroupField } from "./components/radio"
export type { RadioGroupFieldProps, RadioGroupFieldOption } from "./components/radio"

/* Radio Variants */
export {
  YesNoRadioGroup,
  RatingRadioGroup,
  OptionRadioGroup,
} from "./components/radio"
export type {
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

/* Badge Context Variants */
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
export {
  Switch,
  SwitchField,
  FeatureToggle,
  PreferenceSwitch,
  PermissionSwitch,
} from "./components/switch"
export type {
  SwitchProps,
  SwitchFieldProps,
  FeatureToggleProps,
  PreferenceSwitchProps,
  PermissionSwitchProps,
} from "./components/switch"
export { SwitchSize } from "@marwes-ui/core"

/* Slider */
export {
  Slider,
  SliderField,
  VolumeSlider,
  BrightnessSlider,
  RadiusSlider,
} from "./components/slider"
export type {
  SliderProps,
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
export { Pagination } from "./components/pagination"
export type { PaginationProps } from "./components/pagination"

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

// ======= MOLECULES =======

/* CheckboxField */
export { CheckboxField } from "./components/checkbox/checkbox-field"
export type { CheckboxFieldProps } from "./components/checkbox/checkbox-field"

/* CheckboxGroupField */
export { CheckboxGroupField } from "./components/checkbox/checkbox-group-field"
export type {
  CheckboxGroupFieldProps,
  CheckboxGroupFieldOption,
} from "./components/checkbox/checkbox-group-field"

/* InputField and Input purpose variants */
