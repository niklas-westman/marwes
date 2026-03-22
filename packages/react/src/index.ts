export { MarwesProvider } from "./provider/marwes-provider"
export type { MarwesProviderProps } from "./provider/marwes-provider"
export { useTheme } from "./provider/use-theme"

// Re-export core types for good DX
export type { Theme, ThemeMode, ResolvedTheme, ThemeInput, Density } from "@marwes-ui/core"
export type { ToneName } from "@marwes-ui/core"

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
export { Input } from "./components/input"
export type { InputProps } from "./components/input"

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
export { Divider } from "./components/divider"
export type { DividerProps } from "./components/divider"

/* Heading */
export { H1, H2, H3 } from "./components/heading"
export type { H1Props, H2Props, H3Props } from "./components/heading"

/* Paragraph */
export { Paragraph } from "./components/paragraph"
export type { ParagraphProps } from "./components/paragraph"

/* Card */
export { Card } from "./components/card"
export type { CardProps } from "./components/card"

/* Toast */
export { Toast } from "./components/toast"
export type { ToastProps } from "./components/toast"

/* Accordion */
export { Accordion } from "./components/accordion"
export type { AccordionProps } from "./components/accordion"

/* Radio */
export { Radio } from "./components/radio"
export type { RadioProps } from "./components/radio"

/* Badge */
export { Badge } from "./components/badge"
export type { BadgeProps } from "./components/badge"

/* Switch */
export { Switch } from "./components/switch"
export type { SwitchProps } from "./components/switch"

/* Tab */
export { Tab } from "./components/tab"
export type { TabProps } from "./components/tab"

// ======= MOLECULES =======

/* CheckboxField */
export { CheckboxField } from "./components/checkbox/checkbox-field"
export type { CheckboxFieldProps } from "./components/checkbox/checkbox-field"

/* InputField */
export { InputField } from "./components/input-field"
export type { InputFieldProps } from "./components/input-field"

/* Field Variants */
export {
  SearchField,
  PasswordField,
  EmailField,
  PhoneField,
  URLField,
  CurrencyField,
} from "./components/field-variants"
export type {
  SearchFieldProps,
  PasswordFieldProps,
  EmailFieldProps,
  PhoneFieldProps,
  URLFieldProps,
  CurrencyFieldProps,
} from "./components/field-variants"
