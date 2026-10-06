import type { CssVars, TextareaOptions } from "@marwes-ui/core"
import { createTextareaRecipe, toTextareaHtmlAttributes } from "@marwes-ui/core"
import type * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { toReactAttributes } from "../../internal/react-attributes"

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

  const htmlAttributes = toReactAttributes(toTextareaHtmlAttributes(kit.a11y))

  return (
    <textarea
      {...htmlAttributes}
      className={className}
      style={style}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={handleChange}
    />
  )
}
