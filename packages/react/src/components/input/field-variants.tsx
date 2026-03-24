import { buildCurrencyHelperText } from "@marwes-ui/core"
import type * as React from "react"
import type { InputProps } from "./input"
import { InputField, type InputFieldProps } from "./input-field"

/**
 * Field Variants - AI-Friendly Components
 *
 * These variants encode best practices and automatically set AI-friendly
 * metadata, making it easier for both developers and AI tools to understand
 * the purpose and behavior of each field.
 *
 * Each variant manages its own purpose-specific logic (password toggle,
 * search clear, etc.) and sets appropriate semantic attributes.
 */

// ============================================================================
// SEARCH FIELD - Search inputs with clear button
// ============================================================================

export type SearchFieldProps = Omit<InputFieldProps, "input"> & {
  /**
   * Input-specific props (type is auto-set to "search")
   */
  input?: Omit<InputProps, "type">
}

/**
 * SearchField - For search inputs with automatic clear button functionality.
 *
 * **AI Context:**
 * - Sets `type="search"` automatically
 * - Sets `inputMode="search"` for mobile keyboards
 * - Shows clear button (X icon) when field has content
 * - Adds `data-purpose="search"` for AI parsing
 *
 * **Features:**
 * - Automatic clear button that appears when typing
 * - Native search input behavior
 * - Optimized mobile keyboard
 * - Controlled and uncontrolled modes supported
 *
 * @example Basic usage
 * ```tsx
 * import { SearchField } from "@marwes-ui/react";
 *
 * export function Example() {
 *   const [query, setQuery] = React.useState("");
 *   return (
 *     <SearchField
 *       label="Search products"
 *       input={{ value: query, onValueChange: setQuery }}
 *     />
 *   );
 * }
 * ```
 */
export function SearchField(props: SearchFieldProps): React.ReactElement {
  // Enhanced input props with search-specific settings
  const enhancedInput: InputProps = {
    ...props.input,
    type: "search",
    inputMode: "search",
  }

  return (
    <div data-purpose="search">
      <InputField {...props} input={enhancedInput} />
    </div>
  )
}

// ============================================================================
// PASSWORD FIELD - Password inputs with show/hide toggle
// ============================================================================

export type PasswordFieldProps = Omit<InputFieldProps, "input"> & {
  /**
   * Input-specific props (type is auto-set to "password")
   */
  input?: Omit<InputProps, "type">

  /**
   * Autocomplete hint: "current-password" or "new-password"
   * Defaults to "current-password"
   */
  autoComplete?: "current-password" | "new-password"
}

/**
 * PasswordField - For password inputs with automatic show/hide toggle.
 *
 * **AI Context:**
 * - Sets `type="password"` automatically (toggles to "text" when shown)
 * - Shows eye/eyeOff icon toggle button
 * - Sets appropriate `autoComplete` attribute
 * - Adds `data-purpose="password"` for AI parsing
 *
 * **Features:**
 * - Automatic show/hide toggle with eye icon
 * - Proper autocomplete for password managers
 * - Accessible toggle button with clear labels
 * - Controlled and uncontrolled modes supported
 *
 * @example Basic usage
 * ```tsx
 * import { PasswordField } from "@marwes-ui/react";
 *
 * export function Example() {
 *   const [password, setPassword] = React.useState("");
 *   return (
 *     <PasswordField
 *       label="Password"
 *       input={{ value: password, onValueChange: setPassword }}
 *     />
 *   );
 * }
 * ```
 *
 * @example New password (signup/reset)
 * ```tsx
 * <PasswordField
 *   label="New Password"
 *   autoComplete="new-password"
 *   helperText="Must be at least 8 characters"
 * />
 * ```
 */
export function PasswordField(props: PasswordFieldProps): React.ReactElement {
  const { autoComplete = "current-password", ...restProps } = props

  // Enhanced input props with password-specific settings
  const enhancedInput: InputProps = {
    ...props.input,
    type: "password",
    autoComplete,
  }

  return (
    <div data-purpose="password">
      <InputField {...restProps} input={enhancedInput} />
    </div>
  )
}

// ============================================================================
// EMAIL FIELD - Email inputs with proper semantic attributes
// ============================================================================

export type EmailFieldProps = Omit<InputFieldProps, "input"> & {
  /**
   * Input-specific props (type, inputMode, autoComplete auto-set)
   */
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

/**
 * EmailField - For email address inputs with proper semantic attributes.
 *
 * **AI Context:**
 * - Sets `type="email"` for validation
 * - Sets `inputMode="email"` for optimized mobile keyboard
 * - Sets `autoComplete="email"` for autofill
 * - Adds `data-purpose="email"` for AI parsing
 *
 * **Features:**
 * - Browser email validation
 * - Email-optimized mobile keyboard
 * - Autofill support for email addresses
 *
 * @example
 * ```tsx
 * import { EmailField } from "@marwes-ui/react";
 *
 * <EmailField
 *   label="Email address"
 *   input={{ placeholder: "you@example.com" }}
 * />
 * ```
 */
export function EmailField(props: EmailFieldProps): React.ReactElement {
  const enhancedInput: InputProps = {
    ...props.input,
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  }

  return (
    <div data-purpose="email">
      <InputField {...props} input={enhancedInput} />
    </div>
  )
}

// ============================================================================
// PHONE FIELD - Phone number inputs with proper semantic attributes
// ============================================================================

export type PhoneFieldProps = Omit<InputFieldProps, "input"> & {
  /**
   * Input-specific props (type, inputMode, autoComplete auto-set)
   */
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

/**
 * PhoneField - For phone number inputs with proper semantic attributes.
 *
 * **AI Context:**
 * - Sets `type="tel"` for telephone input
 * - Sets `inputMode="tel"` for phone keyboard
 * - Sets `autoComplete="tel"` for autofill
 * - Adds `data-purpose="phone"` for AI parsing
 *
 * **Features:**
 * - Phone-optimized mobile keyboard
 * - Autofill support for phone numbers
 * - Accepts any phone format (formatting should be done externally)
 *
 * @example
 * ```tsx
 * import { PhoneField } from "@marwes-ui/react";
 *
 * <PhoneField
 *   label="Phone number"
 *   input={{ placeholder: "+1 (555) 000-0000" }}
 * />
 * ```
 */
export function PhoneField(props: PhoneFieldProps): React.ReactElement {
  const enhancedInput: InputProps = {
    ...props.input,
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
  }

  return (
    <div data-purpose="phone">
      <InputField {...props} input={enhancedInput} />
    </div>
  )
}

// ============================================================================
// URL FIELD - URL inputs with proper semantic attributes
// ============================================================================

export type URLFieldProps = Omit<InputFieldProps, "input"> & {
  /**
   * Input-specific props (type, inputMode, autoComplete auto-set)
   */
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

/**
 * URLField - For URL inputs with proper semantic attributes.
 *
 * **AI Context:**
 * - Sets `type="url"` for URL validation
 * - Sets `inputMode="url"` for URL keyboard
 * - Sets `autoComplete="url"` for autofill
 * - Adds `data-purpose="url"` for AI parsing
 *
 * **Features:**
 * - Browser URL validation
 * - URL-optimized mobile keyboard
 * - Autofill support for URLs
 *
 * @example
 * ```tsx
 * import { URLField } from "@marwes-ui/react";
 *
 * <URLField
 *   label="Website"
 *   input={{ placeholder: "https://example.com" }}
 * />
 * ```
 */
export function URLField(props: URLFieldProps): React.ReactElement {
  const enhancedInput: InputProps = {
    ...props.input,
    type: "url",
    inputMode: "url",
    autoComplete: "url",
  }

  return (
    <div data-purpose="url">
      <InputField {...props} input={enhancedInput} />
    </div>
  )
}

// ============================================================================
// CURRENCY FIELD - Currency/monetary inputs with formatting hints
// ============================================================================

export type CurrencyFieldProps = Omit<InputFieldProps, "input"> & {
  /**
   * Input-specific props (type, inputMode auto-set)
   */
  input?: Omit<InputProps, "type" | "inputMode">

  /**
   * Currency code (e.g., "USD", "EUR", "GBP")
   * Used for helper text and context
   */
  currency?: string
}

/**
 * CurrencyField - For monetary amount inputs with currency context.
 *
 * **AI Context:**
 * - Sets `type="text"` (better browser support than "number")
 * - Sets `inputMode="decimal"` for numeric keyboard with decimal
 * - Adds currency code to helper text if provided
 * - Adds `data-purpose="currency"` and `data-currency` for AI parsing
 *
 * **Features:**
 * - Decimal keyboard on mobile
 * - Currency code display in helper text
 * - Better input control than type="number"
 * - Note: Formatting should be handled by parent component
 *
 * @example
 * ```tsx
 * import { CurrencyField } from "@marwes-ui/react";
 *
 * <CurrencyField
 *   label="Amount"
 *   currency="USD"
 *   input={{ placeholder: "0.00" }}
 * />
 * ```
 */
export function CurrencyField(props: CurrencyFieldProps): React.ReactElement {
  const { currency, ...restProps } = props

  const enhancedInput: InputProps = {
    ...props.input,
    type: "text",
    inputMode: "decimal",
  }

  const helperText = buildCurrencyHelperText(props.helperText, currency)

  return (
    <div data-purpose="currency" data-currency={currency}>
      <InputField {...restProps} input={enhancedInput} helperText={helperText || ""} />
    </div>
  )
}
