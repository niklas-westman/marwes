import type { CssVars, TextareaOptions } from "@marwes-ui/core"
import { createTextareaRecipe } from "@marwes-ui/core"
import type * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"

type StyleWithVars = React.CSSProperties & CssVars

export type TextareaProps = TextareaOptions & {
  onValueChange?: (value: string) => void
  className?: string
}

export function Textarea(props: TextareaProps) {
  const kit = createTextareaRecipe(props)

  useRenderKitDebug(kit, "Textarea")

  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onValueChange?.(e.target.value)
  }

  return (
    <textarea
      className={className}
      style={style}
      id={kit.a11y.id}
      name={kit.a11y.name}
      inputMode={kit.a11y.inputMode}
      autoComplete={kit.a11y.autoComplete}
      placeholder={kit.a11y.placeholder}
      disabled={kit.a11y.disabled}
      readOnly={kit.a11y.readOnly}
      required={kit.a11y.required}
      rows={kit.a11y.rows}
      cols={kit.a11y.cols}
      aria-label={kit.a11y.ariaLabel}
      aria-invalid={kit.a11y.ariaInvalid}
      aria-describedby={kit.a11y.ariaDescribedBy}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={handleChange}
    />
  )
}
