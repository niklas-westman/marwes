import { checkboxRecipe } from "@marwes-ui/core"
import type { CheckboxProps as CoreCheckboxProps, CssVars } from "@marwes-ui/core"
import { computed, defineComponent, h, onMounted, ref, useAttrs, watch } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"
import { useTheme } from "../../provider/use-theme"

export type CheckboxProps = CoreCheckboxProps & {
  modelValue?: boolean
  onCheckedChange?: (checked: boolean) => void
  onChange?: (event: Event) => void
  className?: string
}

const checkboxPropKeys = [
  "size",
  "checked",
  "modelValue",
  "defaultChecked",
  "indeterminate",
  "disabled",
  "required",
  "invalid",
  "id",
  "name",
  "value",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "onCheckedChange",
  "onChange",
  "className",
] as const

export const Checkbox = defineComponent(
  (props: CheckboxProps, { emit }) => {
    const attrs = useAttrs()
    const theme = useTheme()
    const inputRef = ref<HTMLInputElement | null>(null)

    const recipeInput = computed<CoreCheckboxProps>(() => {
      const nextRecipeInput: CoreCheckboxProps = { ...props }
      const checked = props.modelValue ?? props.checked

      if (checked !== undefined) {
        nextRecipeInput.checked = checked
      } else {
        // biome-ignore lint/performance/noDelete: Required for exactOptionalPropertyTypes compatibility
        delete nextRecipeInput.checked
      }

      return nextRecipeInput
    })

    const kit = computed(() => checkboxRecipe({ ...recipeInput.value, theme: theme.value }))

    const syncIndeterminate = () => {
      if (!inputRef.value) {
        return
      }
      inputRef.value.indeterminate = kit.value.indeterminate
    }

    onMounted(syncIndeterminate)
    watch(() => kit.value.indeterminate, syncIndeterminate, { immediate: true })

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h("input", {
        ...passthroughAttrs,
        ref: inputRef,
        type: "checkbox",
        class: className,
        style,
        id: a11y.id,
        name: a11y.name,
        value: a11y.value,
        disabled: a11y.disabled === true,
        required: a11y.required === true,
        "aria-label": a11y.ariaLabel,
        "aria-labelledby": a11y.ariaLabelledBy,
        "aria-describedby": a11y.ariaDescribedBy,
        "aria-checked": a11y.ariaChecked,
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
    name: "MarwesCheckbox",
    inheritAttrs: false,
    props: [...checkboxPropKeys],
    emits: ["update:modelValue", "checked-change", "change"],
  },
)
