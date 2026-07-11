import { createInputOtpRecipe, sanitizeInputOtpValue } from "@marwes-ui/core"
import type { CssVars, InputOtpOptions } from "@marwes-ui/core"
import * as React from "react"

type StyleWithVars = React.CSSProperties & CssVars

/**
 * Props for the bare `InputOtp` atom.
 *
 * The atom renders only the OTP cells + hidden input — no label, helper,
 * or error region. Use `InputOtpField` for labeled forms; reach for the
 * atom directly only when you need a custom layout.
 */
export type InputOtpProps = Omit<InputOtpOptions, "describedBy"> & {
  onValueChange?: (value: string) => void
  className?: string
  /** ID(s) of elements that describe the input. Pre-merged by `InputOtpField`. */
  describedBy?: string
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

/**
 * InputOtp (Atom) — bare OTP cells. Renders the visual cells and a hidden
 * native `<input>` that captures keyboard entry. Pair with `InputOtpField`
 * for label + helper/error wiring, or wire a `<label htmlFor>` yourself.
 */
export function InputOtp(props: InputOtpProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-input-otp-${reactId}`
  const otpLength = Math.max(1, props.length ?? 6)
  const isControlled = props.value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => {
    return sanitizeInputOtpValue(props.defaultValue, otpLength)
  })

  const currentValue = sanitizeInputOtpValue(
    isControlled ? props.value : uncontrolledValue,
    otpLength,
  )

  const recipeOptions: InputOtpOptions = {
    id,
    value: currentValue,
    length: otpLength,
  }

  if (props.name) recipeOptions.name = props.name
  if (props.placeholderCharacter) recipeOptions.placeholderCharacter = props.placeholderCharacter
  if (props.disabled) recipeOptions.disabled = true
  if (props.readOnly) recipeOptions.readOnly = true
  if (props.required) recipeOptions.required = true
  if (props.invalid) recipeOptions.invalid = true
  if (props.describedBy) recipeOptions.describedBy = props.describedBy
  if (props.ariaLabel) recipeOptions.ariaLabel = props.ariaLabel
  if (props.label) recipeOptions.label = props.label
  if (props.ariaLabelledBy) recipeOptions.ariaLabelledBy = props.ariaLabelledBy

  const kit = createInputOtpRecipe(recipeOptions)

  const className = cx(kit.className, props.className)
  const style = kit.vars as StyleWithVars

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = sanitizeInputOtpValue(event.target.value, otpLength)
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }
    props.onValueChange?.(nextValue)
  }

  return (
    <div
      className={className}
      style={style}
      data-component="input-otp"
      data-invalid={props.invalid ? "true" : undefined}
      data-disabled={props.disabled ? "true" : undefined}
    >
      <div className="mw-input-otp__cells">
        {kit.displayCells.map((displayCell) => (
          <span
            key={displayCell.key}
            className={cx("mw-input-otp__cell", displayCell.filled && "mw-input-otp__cell--filled")}
            aria-hidden="true"
          >
            {displayCell.character}
          </span>
        ))}

        <input
          id={kit.a11y.id}
          className="mw-input-otp__input"
          type="text"
          name={kit.a11y.name}
          inputMode={kit.a11y.inputMode}
          autoComplete={kit.a11y.autoComplete}
          maxLength={kit.a11y.maxLength}
          pattern={kit.a11y.pattern}
          disabled={kit.a11y.disabled}
          readOnly={kit.a11y.readOnly}
          required={kit.a11y.required}
          aria-label={kit.a11y.ariaLabel}
          aria-labelledby={kit.a11y.ariaLabelledBy}
          aria-invalid={kit.a11y.ariaInvalid}
          aria-describedby={kit.a11y.ariaDescribedBy}
          value={kit.displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
