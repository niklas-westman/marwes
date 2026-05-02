import type * as React from "react"
import type { SliderProps } from "./slider"
import { SliderField, type SliderFieldProps } from "./slider-field"

type SliderFieldPurposeProps = Omit<
  SliderFieldProps,
  "label" | "slider" | "minValueLabel" | "maxValueLabel"
> & {
  label?: React.ReactNode
  slider?: SliderProps
  orientation?: SliderProps["orientation"]
  minValueLabel?: React.ReactNode
  maxValueLabel?: React.ReactNode
}

export type VolumeSliderProps = SliderFieldPurposeProps

export function VolumeSlider(props: VolumeSliderProps): React.ReactElement {
  const { orientation, slider, ...fieldProps } = props

  return (
    <SliderField
      {...fieldProps}
      label={props.label ?? "Volume"}
      minValueLabel={props.minValueLabel ?? "0"}
      maxValueLabel={props.maxValueLabel ?? "100"}
      slider={{
        min: 0,
        max: 100,
        step: 1,
        showTooltip: true,
        ...(orientation !== undefined ? { orientation } : {}),
        ...slider,
      }}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "volume",
      }}
    />
  )
}

export type BrightnessSliderProps = SliderFieldPurposeProps

export function BrightnessSlider(props: BrightnessSliderProps): React.ReactElement {
  const { orientation, slider, ...fieldProps } = props

  return (
    <SliderField
      {...fieldProps}
      label={props.label ?? "Brightness"}
      minValueLabel={props.minValueLabel ?? "0"}
      maxValueLabel={props.maxValueLabel ?? "100"}
      slider={{
        min: 0,
        max: 100,
        step: 1,
        showTooltip: true,
        ...(orientation !== undefined ? { orientation } : {}),
        ...slider,
      }}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "brightness",
      }}
    />
  )
}

export type RadiusSliderProps = SliderFieldPurposeProps

export function RadiusSlider(props: RadiusSliderProps): React.ReactElement {
  const { orientation, slider, ...fieldProps } = props

  return (
    <SliderField
      {...fieldProps}
      label={props.label ?? "Radius"}
      minValueLabel={props.minValueLabel ?? "0px"}
      maxValueLabel={props.maxValueLabel ?? "48px"}
      slider={{
        min: 0,
        max: 48,
        step: 2,
        showTooltip: true,
        ...(orientation !== undefined ? { orientation } : {}),
        ...slider,
      }}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "radius",
      }}
    />
  )
}
