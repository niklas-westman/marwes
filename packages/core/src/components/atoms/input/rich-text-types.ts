import type { CssVars } from "../../../shared/css-vars"
import type { InputTone } from "./input-types"

export type RichTextFormat = "bold" | "italic" | "underline"

export type RichTextOptions = {
  id?: string
  name?: string

  value?: string
  defaultValue?: string

  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean

  tone?: InputTone
  invalid?: boolean
  describedBy?: string
  labelledBy?: string
  ariaLabel?: string
  allowedFormats?: RichTextFormat[]
}

export type RichTextA11yProps = {
  id?: string
  role: "textbox"
  tabIndex: 0 | -1
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaInvalid?: true
  ariaDisabled?: true
  ariaReadOnly?: true
  ariaRequired?: true
  ariaMultiline: true
}

export type RichTextRenderKit = {
  tag: "div"
  className: string
  vars: CssVars
  a11y: RichTextA11yProps
  dataAttributes: Record<string, string | boolean | undefined>
}
