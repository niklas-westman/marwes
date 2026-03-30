export { MarwesProvider } from "./provider/marwes-provider"
export type { MarwesProviderProps } from "./provider/marwes-provider"
export { useTheme } from "./provider/use-theme"

// Re-export core types for good DX
export type { Theme, ThemeMode, ResolvedTheme, ThemeInput, Density } from "@marwes-ui/core"
export type { ToneName } from "@marwes-ui/core"

// ======= ATOMS =======

/* Button */
export { Button } from "./components/button"
export type { ButtonProps } from "./components/button"
export { ButtonAction, ButtonSize, ButtonVariant } from "@marwes-ui/core"
export {
  DangerButton,
  CreateButton,
  SubmitButton,
  CancelButton,
  LinkButton,
  PrimaryButton,
  SecondaryButton,
  TextButton,
  SuccessButton,
} from "./components/button"
export type {
  DangerButtonProps,
  CreateButtonProps,
  SubmitButtonProps,
  CancelButtonProps,
  LinkButtonProps,
  PrimaryButtonProps,
  SecondaryButtonProps,
  TextButtonProps,
  SuccessButtonProps,
} from "./components/button"

/* Input */
export {
  Input,
  InputField,
  SearchField,
  PasswordField,
  EmailField,
  PhoneField,
  URLField,
  CurrencyField,
} from "./components/input"
export type {
  InputProps,
  InputFieldProps,
  SearchFieldProps,
  PasswordFieldProps,
  EmailFieldProps,
  PhoneFieldProps,
  URLFieldProps,
  CurrencyFieldProps,
} from "./components/input"

/* Icon */
export { Icon } from "./components/icon"
export type { IconProps } from "./components/icon"
export { IconName } from "@marwes-ui/core"

/* Hooks */
export { useRenderKitDebug } from "./hooks/use-renderkit-debug"

/* Checkbox */
export { Checkbox } from "./components/checkbox"
export type { CheckboxProps } from "./components/checkbox"

/* Divider */
export { Divider } from "./components/divider/divider"
export type { DividerProps } from "./components/divider/divider"

/* Heading */
export { H1, H2, H3 } from "./components/heading"
export type { H1Props, H2Props, H3Props } from "./components/heading"

/* Paragraph */
export { Paragraph } from "./components/paragraph"
export type { ParagraphProps } from "./components/paragraph"

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

// ======= MOLECULES =======

/* CheckboxField */
export { CheckboxField } from "./components/checkbox/checkbox-field"
export type { CheckboxFieldProps } from "./components/checkbox/checkbox-field"

/* InputField and Input purpose variants */
