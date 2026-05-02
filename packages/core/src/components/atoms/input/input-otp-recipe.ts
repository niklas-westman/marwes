import type { CssVars } from "../../../shared/css-vars"
import { resolveInputOtpA11y } from "./input-otp-a11y"
import type { InputOtpOptions, InputOtpRenderKit } from "./input-otp-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function sanitizeInputOtpValue(rawValue: string | undefined, length: number): string {
  if (!rawValue) {
    return ""
  }

  let sanitizedValue = ""

  for (const character of rawValue) {
    if (character < "0" || character > "9") {
      continue
    }

    sanitizedValue += character

    if (sanitizedValue.length >= length) {
      return sanitizedValue
    }
  }

  return sanitizedValue
}

export function createInputOtpRecipe(options: InputOtpOptions): InputOtpRenderKit {
  const otpLength = Math.max(1, options.length ?? 6)
  const placeholderCharacter = options.placeholderCharacter ?? "·"
  const displayValue = sanitizeInputOtpValue(options.value ?? options.defaultValue, otpLength)
  const displayCharacters = Array.from({ length: otpLength }, (_, index) => {
    return displayValue[index] ?? placeholderCharacter
  })
  const displayCells = displayCharacters.map((character, index) => ({
    key: `otp-cell-${index + 1}`,
    character,
    filled: index < displayValue.length,
  }))

  const vars: CssVars = {
    "--mw-input-otp-cell-count": String(otpLength),
  }

  return {
    tag: "div",
    className: cx(
      "mw-input-otp",
      options.invalid && "mw-input-otp--invalid",
      options.disabled && "mw-input-otp--disabled",
      options.readOnly && "mw-input-otp--readonly",
    ),
    vars,
    a11y: resolveInputOtpA11y({ ...options, length: otpLength }),
    displayValue,
    displayCharacters,
    displayCells,
  }
}
