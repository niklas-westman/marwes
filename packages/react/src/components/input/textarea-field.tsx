import { buildInputFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { Textarea } from "./textarea"
import type { TextareaProps } from "./textarea"

export type TextareaFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  textarea: TextareaProps
  ariaDescribedBy?: string
}

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export function TextareaField(props: TextareaFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-textarea-${reactId}`

  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)

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

  const disabled = props.textarea.disabled || false
  const readOnly = props.textarea.readOnly || false
  const invalid = hasError || props.textarea.invalid || false

  const wrapperClass = cx(
    "mw-input-field",
    "mw-input-field--textarea",
    disabled && "mw-input-field--disabled",
    invalid && "mw-input-field--invalid",
    readOnly && "mw-input-field--readonly",
  )

  const textareaProps: TextareaProps = {
    ...props.textarea,
    id,
    invalid,
  }

  if (mergedDescribedBy) {
    textareaProps.describedBy = mergedDescribedBy
  }

  return (
    <div className={wrapperClass}>
      <label className="mw-input-field__label" htmlFor={id}>
        <Text variant="label">{props.label}</Text>
      </label>

      <div className="mw-input-field__input-wrapper">
        <Textarea {...textareaProps} />
      </div>

      {hasHelperText && !hasError && (
        <div className="mw-input-field__helper" id={helperTextId}>
          <Text variant="caption">{props.helperText}</Text>
        </div>
      )}

      {hasError && (
        <div className="mw-input-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
