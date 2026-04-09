import { buildSliderFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Slider, type SliderProps } from "./slider"

export type SliderFieldProps = {
  id?: string
  label: string
  description?: string
  error?: string
  slider?: SliderProps
  ariaDescribedBy?: string
  minValueLabel?: string
  maxValueLabel?: string
  showEdgeValues?: boolean
  dataAttributes?: Record<string, string>
  modelValue?: number
}

const sliderFieldPropKeys = [
  "id",
  "label",
  "description",
  "error",
  "slider",
  "ariaDescribedBy",
  "minValueLabel",
  "maxValueLabel",
  "showEdgeValues",
  "dataAttributes",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const SliderField = defineComponent(
  (props: SliderFieldProps, { slots, emit }) => {
    const localSliderId = createLocalId("mw-slider")
    const id = computed(() => props.id ?? localSliderId)
    const sourceSlider = computed<SliderProps>(() => props.slider ?? {})
    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))
    const showEdgeValues = computed(() => props.showEdgeValues !== false)
    const a11yIds = computed(() =>
      buildSliderFieldA11yIds({
        id: id.value,
        hasDescription: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const disabled = computed(() => sourceSlider.value.disabled || false)
    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-slider-field",
        disabled.value && "mw-slider-field--disabled",
        hasError.value && "mw-slider-field--invalid",
      ),
    )

    const minValueLabel = computed(() => props.minValueLabel ?? `${sourceSlider.value.min ?? 0}`)
    const maxValueLabel = computed(() => props.maxValueLabel ?? `${sourceSlider.value.max ?? 100}`)

    const mergedSliderProps = computed<SliderProps>(() => {
      const {
        ariaLabel: _ignoredAriaLabel,
        ariaLabelledBy: _ignoredAriaLabelledBy,
        ariaDescribedBy: _ignoredAriaDescribedBy,
        onValueChange: originalOnValueChange,
        ...restSliderProps
      } = sourceSlider.value

      const nextSliderProps: SliderProps = {
        ...restSliderProps,
        id: id.value,
        ariaLabelledBy: a11yIds.value.labelId,
        onValueChange: (nextValue: number) => {
          originalOnValueChange?.(nextValue)
          emit("update:modelValue", nextValue)
          emit("value-change", nextValue)
        },
      }

      if (props.modelValue !== undefined) {
        nextSliderProps.modelValue = props.modelValue
      }

      if (a11yIds.value.describedBy) {
        nextSliderProps.ariaDescribedBy = a11yIds.value.describedBy
      }

      return nextSliderProps
    })

    const labelContent = () => slots.label?.() ?? [props.label]
    const descriptionContent = () =>
      slots.description?.() ?? (props.description ? [props.description] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h(
        "div",
        {
          class: wrapperClass.value,
          ...(props.dataAttributes ?? {}),
        },
        [
          h("div", { class: "mw-slider-field__header" }, [
            h("div", { class: "mw-slider-field__label", id: a11yIds.value.labelId }, [
              h(Paragraph, { size: "md" }, { default: labelContent }),
            ]),
          ]),

          hasDescription.value
            ? h("div", { class: "mw-slider-field__description", id: a11yIds.value.descriptionId }, [
                h(Paragraph, { size: "sm" }, { default: descriptionContent }),
              ])
            : null,

          h("div", { class: "mw-slider-field__control-row" }, [
            showEdgeValues.value
              ? h(
                  "span",
                  { class: "mw-slider-field__edge-value mw-slider-field__edge-value--min" },
                  [h(Paragraph, { size: "sm" }, { default: () => [minValueLabel.value] })],
                )
              : null,
            h("div", { class: "mw-slider-field__slider" }, [
              h(Slider, {
                ...mergedSliderProps.value,
                "aria-invalid": hasError.value ? true : undefined,
              }),
            ]),
            showEdgeValues.value
              ? h(
                  "span",
                  { class: "mw-slider-field__edge-value mw-slider-field__edge-value--max" },
                  [h(Paragraph, { size: "sm" }, { default: () => [maxValueLabel.value] })],
                )
              : null,
          ]),

          hasError.value
            ? h(
                "div",
                {
                  class: "mw-slider-field__error",
                  id: a11yIds.value.errorId,
                  "aria-live": "polite",
                },
                [h(Paragraph, { size: "sm" }, { default: errorContent })],
              )
            : null,
        ],
      )
  },
  {
    name: "MarwesSliderField",
    props: [...sliderFieldPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
