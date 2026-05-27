import {
  buildInputFieldA11yIds,
  createInputOtpRecipe,
  sanitizeInputOtpValue,
} from "@marwes-ui/core"
import type { CssVars, InputOtpOptions } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"

type StyleWithVars = React.CSSProperties & CssVars

export type InputOtpProps = Omit<InputOtpOptions, "describedBy"> & {
  label: string
  helperText?: string
  error?: string
  ariaDescribedBy?: string
  onValueChange?: (value: string) => void
  className?: string
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export function InputOtp(props: InputOtpProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-input-otp-${reactId}`
  const otpLength = Math.max(1, props.length ?? 6)
  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)
  const invalid = hasError || props.invalid === true
  const isControlled = props.value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => {
    return sanitizeInputOtpValue(props.defaultValue, otpLength)
  })

  const currentValue = sanitizeInputOtpValue(
    isControlled ? props.value : uncontrolledValue,
    otpLength,
  )

  const {
    helperTextId,
    errorId,
    describedBy: mergedDescribedBy,
  } = buildInputFieldA11yIds({
    id,
    hasHelperText,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const recipeOptions: InputOtpOptions = {
    id,
    value: currentValue,
    length: otpLength,
    invalid,
  }

  if (props.name) {
    recipeOptions.name = props.name
  }

  if (props.placeholderCharacter) {
    recipeOptions.placeholderCharacter = props.placeholderCharacter
  }

  if (props.disabled) {
    recipeOptions.disabled = true
  }

  if (props.readOnly) {
    recipeOptions.readOnly = true
  }

  if (props.required) {
    recipeOptions.required = true
  }

  if (mergedDescribedBy) {
    recipeOptions.describedBy = mergedDescribedBy
  }

  if (props.ariaLabel) {
    recipeOptions.ariaLabel = props.ariaLabel
  }

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
      data-invalid={invalid ? "true" : undefined}
      data-disabled={props.disabled ? "true" : undefined}
    >
      <label className="mw-input-otp__label" htmlFor={id}>
        <Text variant="label">{props.label}</Text>
      </label>

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
          aria-invalid={kit.a11y.ariaInvalid}
          aria-describedby={kit.a11y.ariaDescribedBy}
          value={kit.displayValue}
          onChange={handleChange}
        />
      </div>

      {hasError ? (
        <div className="mw-input-otp__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      ) : hasHelperText ? (
        <div className="mw-input-otp__helper" id={helperTextId}>
          <Text variant="caption">{props.helperText}</Text>
        </div>
      ) : null}
    </div>
  )
}
