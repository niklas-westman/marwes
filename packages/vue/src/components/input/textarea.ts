import type { CssVars, TextareaOptions } from "@marwes-ui/core"
import { createTextareaRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type TextareaProps = TextareaOptions & {
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

const textareaPropKeys = [
  "id",
  "name",
  "value",
  "modelValue",
  "defaultValue",
  "placeholder",
  "disabled",
  "readOnly",
  "required",
  "inputMode",
  "autoComplete",
  "rows",
  "cols",
  "resize",
  "tone",
  "invalid",
  "describedBy",
  "ariaLabel",
  "ariaLabelledBy",
  "label",
  "onValueChange",
  "className",
] as const

export const Textarea = defineComponent(
  (props: TextareaProps, { emit }) => {
    const attrs = useAttrs()
    const kit = computed(() => createTextareaRecipe(props))

    useRenderKitDebug(kit, "Textarea")

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)
      const controlledValue = props.modelValue ?? props.value
      const textareaValue = controlledValue ?? props.defaultValue

      return h("textarea", {
        ...passthroughAttrs,
        class: className,
        style,
        id: renderKit.a11y.id,
        name: renderKit.a11y.name,
        inputMode: renderKit.a11y.inputMode,
        autoComplete: renderKit.a11y.autoComplete,
        placeholder: renderKit.a11y.placeholder,
        disabled: renderKit.a11y.disabled,
        readOnly: renderKit.a11y.readOnly,
        required: renderKit.a11y.required,
        rows: renderKit.a11y.rows,
        cols: renderKit.a11y.cols,
        "aria-label": renderKit.a11y.ariaLabel,
        "aria-labelledby": renderKit.a11y.ariaLabelledBy,
        "aria-invalid": renderKit.a11y.ariaInvalid,
        "aria-describedby": renderKit.a11y.ariaDescribedBy,
        value: textareaValue,
        onInput: (event: Event) => {
          const target = event.target as HTMLTextAreaElement
          const nextValue = target.value
          props.onValueChange?.(nextValue)
          emit("update:modelValue", nextValue)
          emit("value-change", nextValue)
        },
        onChange: (event: Event) => emit("change", event),
      })
    }
  },
  {
    name: "MarwesTextarea",
    inheritAttrs: false,
    props: [...textareaPropKeys],
    emits: ["update:modelValue", "value-change", "change"],
  },
)
