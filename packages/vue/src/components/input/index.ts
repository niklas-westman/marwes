// `Input` (the atom) is intentionally NOT re-exported here.
// Use `InputField` (or a purpose variant) instead. Internal consumers
// can deep-import "./input" directly.

// `Select` (the atom) is intentionally NOT re-exported here.
// Use `SelectField` (or `DropdownField`) instead. Internal consumers
// can deep-import "./select" directly.
export type { SelectAppearance, SelectOption } from "./select"

// `Textarea` (the atom) is intentionally NOT re-exported here.
// Use `TextareaField` instead. Internal consumers can deep-import
// "./textarea" directly.

// `RichText` (the atom) is intentionally NOT re-exported here.
// Use `RichTextField` instead. Internal consumers can deep-import
// "./rich-text" directly.

export { InputField } from "./input-field"
export type { InputFieldProps } from "./input-field"

// `InputOtp` (the bare atom — cells-only render) is intentionally NOT
// re-exported here. Use `InputOtpField` instead. Internal consumers can
// deep-import "./input-otp" directly.

export { InputOtpField } from "./input-otp-field"
export type { InputOtpFieldProps } from "./input-otp-field"

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
