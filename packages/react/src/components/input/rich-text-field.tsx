import { buildRichTextFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { RichText } from "./rich-text"
import type { RichTextProps } from "./rich-text"

export type RichTextFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  editor: RichTextProps
  ariaDescribedBy?: string
}

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export function RichTextField(props: RichTextFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-rich-text-${reactId}`
  const editorRef = React.useRef<HTMLDivElement | null>(null)

  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)

  const { labelId, helperTextId, errorId, describedBy } = buildRichTextFieldA11yIds({
    id,
    hasHelperText,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const disabled = props.editor.disabled || false
  const readOnly = props.editor.readOnly || false
  const invalid = hasError || props.editor.invalid || false

  const wrapperClass = cx(
    "mw-input-field",
    "mw-input-field--rich-text",
    disabled && "mw-input-field--disabled",
    invalid && "mw-input-field--invalid",
    readOnly && "mw-input-field--readonly",
  )

  const editorProps: RichTextProps = {
    ...props.editor,
    id,
    invalid,
    labelledBy: labelId,
  }

  if (describedBy) {
    editorProps.describedBy = describedBy
  }

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        className="mw-input-field__label"
        id={labelId}
        onClick={() => {
          editorRef.current?.focus()
        }}
      >
        <Text variant="label">{props.label}</Text>
      </button>

      <div className="mw-input-field__input-wrapper">
        <RichText ref={editorRef} {...editorProps} />
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
