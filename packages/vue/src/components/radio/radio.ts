import { radioRecipe } from "@marwes-ui/core"
import type { RadioOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export type RadioProps = RadioOptions & {
  modelValue?: boolean
  onCheckedChange?: (checked: boolean) => void
  onChange?: (event: Event) => void
  className?: string
}

const radioPropKeys = [
  "checked",
  "modelValue",
  "defaultChecked",
  "disabled",
  "required",
  "invalid",
  "id",
  "name",
  "value",
  "ariaLabel",
  "label",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "onCheckedChange",
  "onChange",
  "className",
] as const

export const Radio = defineComponent(
  (props: RadioProps, { emit }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: RadioOptions = {}
      const checked = props.modelValue ?? props.checked
      if (checked !== undefined) opts.checked = checked
      if (props.defaultChecked !== undefined) opts.defaultChecked = props.defaultChecked
      if (props.disabled !== undefined) opts.disabled = props.disabled
      if (props.required !== undefined) opts.required = props.required
      if (props.invalid !== undefined) opts.invalid = props.invalid
      if (props.id !== undefined) opts.id = props.id
      if (props.name !== undefined) opts.name = props.name
      if (props.value !== undefined) opts.value = props.value
      if (props.ariaLabel !== undefined) opts.ariaLabel = props.ariaLabel
      if (props.label !== undefined) opts.label = props.label
      if (props.ariaLabelledBy !== undefined) opts.ariaLabelledBy = props.ariaLabelledBy
      if (props.ariaDescribedBy !== undefined) opts.ariaDescribedBy = props.ariaDescribedBy
      return radioRecipe(opts)
    })

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)

      return h("input", {
        ...passthroughAttrs,
        type: "radio",
        class: className,
        id: a11y.id,
        name: a11y.name,
        value: a11y.value,
        disabled: a11y.disabled === true,
        required: a11y.required === true,
        "aria-label": a11y.ariaLabel,
        "aria-labelledby": a11y.ariaLabelledBy,
        "aria-describedby": a11y.ariaDescribedBy,
        "aria-invalid": a11y.ariaInvalid === true ? true : undefined,
        checked: renderKit.checked ?? renderKit.defaultChecked,
        onChange: (event: Event) => {
          props.onChange?.(event)
          const target = event.target as HTMLInputElement
          props.onCheckedChange?.(target.checked)
          emit("update:modelValue", target.checked)
          emit("checked-change", target.checked)
          emit("change", event)
        },
      })
    }
  },
  {
    name: "MarwesRadio",
    inheritAttrs: false,
    props: [...radioPropKeys],
    emits: ["update:modelValue", "checked-change", "change"],
  },
)
