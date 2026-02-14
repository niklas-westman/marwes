import * as React from "react"
import type { CssVars, InputOptions } from "@marwes/core"
import { createInputRecipe } from "@marwes/core"
import { useTheme } from "../provider/use-theme"
import { useRenderKitDebug } from "../hooks/use-renderkit-debug"

type StyleWithVars = React.CSSProperties & CssVars

export type InputProps = InputOptions & {
  onValueChange?: (value: string) => void
  className?: string
}

export function Input(props: InputProps) {
  const theme = useTheme()
  const kit = createInputRecipe(theme, props)
  
  // Debug hook for Storybook RenderKit addon
  useRenderKitDebug(kit, "Input")

  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onValueChange?.(e.target.value)
  }

  return (
    <input
      className={className}
      style={style}
      id={kit.a11y.id}
      name={kit.a11y.name}
      type={kit.a11y.type}
      inputMode={kit.a11y.inputMode}
      autoComplete={kit.a11y.autoComplete}
      placeholder={kit.a11y.placeholder}
      disabled={kit.a11y.disabled}
      readOnly={kit.a11y.readOnly}
      required={kit.a11y.required}
      aria-label={kit.a11y.ariaLabel}
      aria-invalid={kit.a11y.ariaInvalid}
      aria-describedby={kit.a11y.ariaDescribedBy}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={handleChange}
    />
  )
}
