import { defineComponent, h } from "vue"
import type { SliderProps } from "./slider"
import { SliderField, type SliderFieldProps } from "./slider-field"

type SliderFieldPurposeProps = Omit<
  SliderFieldProps,
  "label" | "slider" | "minValueLabel" | "maxValueLabel"
> & {
  label?: string
  slider?: SliderProps
  orientation?: SliderProps["orientation"]
  minValueLabel?: string
  maxValueLabel?: string
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
  "orientation",
  "showEdgeValues",
  "dataAttributes",
  "modelValue",
] as const

export type VolumeSliderProps = SliderFieldPurposeProps

export const VolumeSlider = defineComponent({
  name: "MarwesVolumeSlider",
  inheritAttrs: false,
  props: [...sliderFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as VolumeSliderProps

    return () =>
      h(
        SliderField,
        {
          ...attrs,
          ...props,
          label: props.label ?? "Volume",
          minValueLabel: props.minValueLabel ?? "0",
          maxValueLabel: props.maxValueLabel ?? "100",
          slider: {
            min: 0,
            max: 100,
            step: 1,
            showTooltip: true,
            ...(props.orientation !== undefined ? { orientation: props.orientation } : {}),
            ...props.slider,
          },
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "volume",
          },
        },
        slots,
      )
  },
})

export type BrightnessSliderProps = SliderFieldPurposeProps

export const BrightnessSlider = defineComponent({
  name: "MarwesBrightnessSlider",
  inheritAttrs: false,
  props: [...sliderFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as BrightnessSliderProps

    return () =>
      h(
        SliderField,
        {
          ...attrs,
          ...props,
          label: props.label ?? "Brightness",
          minValueLabel: props.minValueLabel ?? "0",
          maxValueLabel: props.maxValueLabel ?? "100",
          slider: {
            min: 0,
            max: 100,
            step: 1,
            showTooltip: true,
            ...(props.orientation !== undefined ? { orientation: props.orientation } : {}),
            ...props.slider,
          },
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "brightness",
          },
        },
        slots,
      )
  },
})

export type RadiusSliderProps = SliderFieldPurposeProps

export const RadiusSlider = defineComponent({
  name: "MarwesRadiusSlider",
  inheritAttrs: false,
  props: [...sliderFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as RadiusSliderProps

    return () =>
      h(
        SliderField,
        {
          ...attrs,
          ...props,
          label: props.label ?? "Radius",
          minValueLabel: props.minValueLabel ?? "0px",
          maxValueLabel: props.maxValueLabel ?? "48px",
          slider: {
            min: 0,
            max: 48,
            step: 2,
            showTooltip: true,
            ...(props.orientation !== undefined ? { orientation: props.orientation } : {}),
            ...props.slider,
          },
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "radius",
          },
        },
        slots,
      )
  },
})
