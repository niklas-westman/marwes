import { buildSliderFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { Slider, type SliderProps } from "./slider"

export type SliderFieldLabelPosition = "top" | "inline"

export type SliderFieldProps = {
  id?: string
  label: string
  description?: string
  error?: string
  slider?: SliderProps
  ariaDescribedBy?: string
  minValueLabel?: string
  maxValueLabel?: string
  labelPosition?: SliderFieldLabelPosition
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
  "labelPosition",
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
    const labelPosition = computed<SliderFieldLabelPosition>(() => props.labelPosition ?? "top")
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
        labelPosition.value === "top" && "mw-slider-field--label-top",
        labelPosition.value === "inline" && "mw-slider-field--label-inline",
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

    function renderEdgeValue(position: "min" | "max", value: string) {
      return h(
        "span",
        { class: `mw-slider-field__edge-value mw-slider-field__edge-value--${position}` },
        [h(Text, { variant: "caption" }, { default: () => [value] })],
      )
    }

    return () =>
      h(
        "div",
        {
          class: wrapperClass.value,
          "data-label-position": labelPosition.value,
          ...(props.dataAttributes ?? {}),
        },
        [
          h("div", { class: "mw-slider-field__header" }, [
            h("div", { class: "mw-slider-field__label", id: a11yIds.value.labelId }, [
              h(Text, { variant: "label" }, { default: labelContent }),
            ]),
          ]),

          hasDescription.value
            ? h("div", { class: "mw-slider-field__description", id: a11yIds.value.descriptionId }, [
                h(Text, { variant: "caption" }, { default: descriptionContent }),
              ])
            : null,

          labelPosition.value === "top" && showEdgeValues.value
            ? h("div", { class: "mw-slider-field__values-row" }, [
                renderEdgeValue("min", minValueLabel.value),
                renderEdgeValue("max", maxValueLabel.value),
              ])
            : null,

          h("div", { class: "mw-slider-field__control-row" }, [
            labelPosition.value === "inline" && showEdgeValues.value
              ? renderEdgeValue("min", minValueLabel.value)
              : null,
            h("div", { class: "mw-slider-field__slider" }, [
              h(Slider, {
                ...mergedSliderProps.value,
                "aria-invalid": hasError.value ? true : undefined,
              }),
            ]),
            labelPosition.value === "inline" && showEdgeValues.value
              ? renderEdgeValue("max", maxValueLabel.value)
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
                [h(Text, { variant: "caption" }, { default: errorContent })],
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
