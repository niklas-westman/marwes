import type { CssVars, InputOptions } from "@marwes-ui/core"
import { createInputRecipe, toInputHtmlAttributes } from "@marwes-ui/core"
import type * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { toReactAttributes } from "../../internal/react-attributes"

type StyleWithVars = React.CSSProperties & CssVars

export type InputProps = InputOptions & {
  onValueChange?: (value: string) => void
  className?: string
}

export function Input(props: InputProps) {
  const kit = createInputRecipe(props)

  // Debug hook for Storybook RenderKit addon
  useRenderKitDebug(kit, "Input")

  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onValueChange?.(e.target.value)
  }

  const htmlAttributes = toReactAttributes(toInputHtmlAttributes(kit.a11y))

  return (
    <input
      {...htmlAttributes}
      className={className}
      style={style}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={handleChange}
    />
  )
}
