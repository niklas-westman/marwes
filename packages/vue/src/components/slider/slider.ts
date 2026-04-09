import type { CssVars, SliderOptions } from "@marwes-ui/core"
import { createSliderRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, ref, useAttrs, watch } from "vue"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SliderProps = SliderOptions & {
  modelValue?: number
  onValueChange?: (value: number) => void
  onChange?: (event: Event) => void
  className?: string
}

type SliderOptionDraft = {
  [Key in keyof SliderOptions]?: SliderOptions[Key] | undefined
}

const sliderPropKeys = [
  "id",
  "name",
  "min",
  "max",
  "step",
  "value",
  "modelValue",
  "defaultValue",
  "disabled",
  "required",
  "showTooltip",
  "showTouchArea",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "ariaValueText",
  "onValueChange",
  "onChange",
  "className",
] as const

function buildSliderOptions(options: SliderOptionDraft): SliderOptions {
  const sliderOptions: SliderOptions = {}

  if (options.id !== undefined) sliderOptions.id = options.id
  if (options.name !== undefined) sliderOptions.name = options.name
  if (options.min !== undefined) sliderOptions.min = options.min
  if (options.max !== undefined) sliderOptions.max = options.max
  if (options.step !== undefined) sliderOptions.step = options.step
  if (options.value !== undefined) sliderOptions.value = options.value
  if (options.defaultValue !== undefined) sliderOptions.defaultValue = options.defaultValue
  if (options.disabled !== undefined) sliderOptions.disabled = options.disabled
  if (options.required !== undefined) sliderOptions.required = options.required
  if (options.showTooltip !== undefined) sliderOptions.showTooltip = options.showTooltip
  if (options.showTouchArea !== undefined) sliderOptions.showTouchArea = options.showTouchArea
  if (options.ariaLabel !== undefined) sliderOptions.ariaLabel = options.ariaLabel
  if (options.ariaLabelledBy !== undefined) sliderOptions.ariaLabelledBy = options.ariaLabelledBy
  if (options.ariaDescribedBy !== undefined) sliderOptions.ariaDescribedBy = options.ariaDescribedBy
  if (options.ariaValueText !== undefined) sliderOptions.ariaValueText = options.ariaValueText

  return sliderOptions
}

function resolveSliderValue(options: SliderOptionDraft): number {
  return createSliderRecipe(buildSliderOptions(options)).value
}

export const Slider = defineComponent(
  (props: SliderProps, { emit }) => {
    const attrs = useAttrs()
    const uncontrolledValue = ref(
      resolveSliderValue({
        min: props.min,
        max: props.max,
        step: props.step,
        value: props.modelValue ?? props.value,
        defaultValue: props.defaultValue,
      }),
    )

    const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)

    watch(
      () => [props.modelValue, props.value, props.defaultValue, props.min, props.max, props.step],
      () => {
        if (!isControlled.value) {
          uncontrolledValue.value = resolveSliderValue({
            min: props.min,
            max: props.max,
            step: props.step,
            defaultValue: props.defaultValue,
          })
        }
      },
    )

    const currentValue = computed(() => {
      if (isControlled.value) {
        return resolveSliderValue({
          min: props.min,
          max: props.max,
          step: props.step,
          value: props.modelValue ?? props.value,
        })
      }

      return uncontrolledValue.value
    })

    const kit = computed(() =>
      createSliderRecipe(
        buildSliderOptions({
          id: props.id,
          name: props.name,
          min: props.min,
          max: props.max,
          step: props.step,
          value: currentValue.value,
          disabled: props.disabled,
          required: props.required,
          showTooltip: props.showTooltip,
          showTouchArea: props.showTouchArea,
          ariaLabel: props.ariaLabel,
          ariaLabelledBy: props.ariaLabelledBy,
          ariaDescribedBy: props.ariaDescribedBy,
          ariaValueText: props.ariaValueText,
        }),
      ),
    )

    useRenderKitDebug(kit, "Slider")

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h(
        "div",
        {
          class: className,
          style,
          ...renderKit.dataAttributes,
        },
        [
          renderKit.showTooltip
            ? h(
                "span",
                {
                  class: "mw-slider__tooltip",
                  "aria-hidden": "true",
                },
                String(currentValue.value),
              )
            : null,
          h("div", { class: "mw-slider__control" }, [
            h("input", {
              ...passthroughAttrs,
              type: renderKit.a11y.type,
              class: renderKit.inputClassName,
              id: renderKit.a11y.id,
              name: renderKit.a11y.name,
              min: renderKit.a11y.min,
              max: renderKit.a11y.max,
              step: renderKit.a11y.step,
              disabled: renderKit.a11y.disabled === true,
              required: renderKit.a11y.required === true,
              "aria-label": renderKit.a11y.ariaLabel,
              "aria-labelledby": renderKit.a11y.ariaLabelledBy,
              "aria-describedby": renderKit.a11y.ariaDescribedBy,
              "aria-valuetext": renderKit.a11y.ariaValueText,
              value: currentValue.value,
              onInput: (event: Event) => {
                const target = event.target as HTMLInputElement
                const nextValue = Number(target.value)

                if (!isControlled.value) {
                  uncontrolledValue.value = nextValue
                }

                props.onValueChange?.(nextValue)
                emit("update:modelValue", nextValue)
                emit("value-change", nextValue)
              },
              onChange: (event: Event) => {
                props.onChange?.(event)
                emit("change", event)
              },
            }),
            h("div", { class: "mw-slider__visual", "aria-hidden": "true" }, [
              h("span", { class: "mw-slider__track" }),
              h("span", { class: "mw-slider__fill" }),
              h("span", { class: "mw-slider__touch-area" }),
              h("span", { class: "mw-slider__thumb" }),
            ]),
          ]),
        ],
      )
    }
  },
  {
    name: "MarwesSlider",
    inheritAttrs: false,
    props: [...sliderPropKeys],
    emits: ["update:modelValue", "value-change", "change"],
  },
)
