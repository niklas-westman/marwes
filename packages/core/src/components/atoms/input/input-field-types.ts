/** Accessible names for the actions InputField adds inside the control. */
export interface InputFieldActionOptions {
  /** Name of the password toggle while the password is hidden. Defaults to "Show password". */
  showPasswordLabel?: string
  /** Name of the password toggle while the password is visible. Defaults to "Hide password". */
  hidePasswordLabel?: string
  /** Name of the search clear button. Defaults to "Clear search". */
  clearLabel?: string
}

/** ARIA fields for an icon-only action button inside the input field. */
export interface InputFieldActionA11yProps {
  ariaLabel: string
}
