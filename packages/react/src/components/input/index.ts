export { Input } from "./input"
export type { InputProps } from "./input"

export { Select } from "./select"
export type { SelectProps, SelectAppearance, SelectOption } from "./select"

// `Textarea` (the atom) is intentionally NOT re-exported here.
// Use `TextareaField` instead. Internal consumers can deep-import
// "./textarea" directly.

// `RichText` (the atom) is intentionally NOT re-exported here.
// Use `RichTextField` instead. Internal consumers can deep-import
// "./rich-text" directly.

export { InputField } from "./input-field"
export type { InputFieldProps } from "./input-field"

export { InputOtp } from "./input-otp"
export type { InputOtpProps } from "./input-otp"

export { SelectField } from "./select-field"
export type { SelectFieldProps, SelectFieldVariant } from "./select-field"

export { TextareaField } from "./textarea-field"
export type { TextareaFieldProps } from "./textarea-field"

export { RichTextField } from "./rich-text-field"
export type { RichTextFieldProps } from "./rich-text-field"

export {
  DropdownField,
  SearchField,
  PasswordField,
  EmailField,
  DateOfBirthField,
  ZipCodeField,
  PhoneField,
  URLField,
  CurrencyField,
} from "./field-variants"
export type {
  DropdownFieldProps,
  SearchFieldProps,
  PasswordFieldProps,
  EmailFieldProps,
  DateOfBirthFieldProps,
  ZipCodeFieldProps,
  PhoneFieldProps,
  URLFieldProps,
  CurrencyFieldProps,
} from "./field-variants"
