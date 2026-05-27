import { buildSliderFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { Slider } from "./slider"
import type { SliderProps } from "./slider"

export type SliderFieldLabelPosition = "top" | "inline"

export type SliderFieldProps = {
  id?: string
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  slider: SliderProps
  ariaDescribedBy?: string
  minValueLabel?: React.ReactNode
  maxValueLabel?: React.ReactNode
  labelPosition?: SliderFieldLabelPosition
  showEdgeValues?: boolean
  dataAttributes?: Record<string, string>
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

function resolveEdgeValueLabel(
  value: React.ReactNode | undefined,
  fallback: number,
): React.ReactNode {
  return value ?? `${fallback}`
}

export function SliderField(props: SliderFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-slider-${reactId}`
  const hasDescription = hasContent(props.description)
  const hasError = hasContent(props.error)
  const { labelId, descriptionId, errorId, describedBy } = buildSliderFieldA11yIds({
    id,
    hasDescription,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const disabled = props.slider.disabled || false
  const labelPosition = props.labelPosition ?? "top"
  const showEdgeValues = props.showEdgeValues !== false
  const minValue = props.slider.min ?? 0
  const maxValue = props.slider.max ?? 100
  const minValueLabel = resolveEdgeValueLabel(props.minValueLabel, minValue)
  const maxValueLabel = resolveEdgeValueLabel(props.maxValueLabel, maxValue)
  const wrapperClass = cx(
    "mw-slider-field",
    labelPosition === "top" && "mw-slider-field--label-top",
    labelPosition === "inline" && "mw-slider-field--label-inline",
    disabled && "mw-slider-field--disabled",
    hasError && "mw-slider-field--invalid",
  )

  const {
    ariaLabel: _ignoredAriaLabel,
    ariaLabelledBy: _ignoredAriaLabelledBy,
    ariaDescribedBy: _ignoredAriaDescribedBy,
    style: sliderStyle,
    ...sliderProps
  } = props.slider

  const renderEdgeValue = (position: "min" | "max", value: React.ReactNode): React.ReactElement => (
    <span className={`mw-slider-field__edge-value mw-slider-field__edge-value--${position}`}>
      <Text variant="caption">{value}</Text>
    </span>
  )

  return (
    <div className={wrapperClass} data-label-position={labelPosition} {...props.dataAttributes}>
      <div className="mw-slider-field__header">
        <div className="mw-slider-field__label" id={labelId}>
          <Text variant="label">{props.label}</Text>
        </div>
      </div>

      {hasDescription && (
        <div className="mw-slider-field__description" id={descriptionId}>
          <Text variant="caption">{props.description}</Text>
        </div>
      )}

      {labelPosition === "top" && showEdgeValues ? (
        <div className="mw-slider-field__values-row">
          {renderEdgeValue("min", minValueLabel)}
          {renderEdgeValue("max", maxValueLabel)}
        </div>
      ) : null}

      <div className="mw-slider-field__control-row">
        {labelPosition === "inline" && showEdgeValues
          ? renderEdgeValue("min", minValueLabel)
          : null}

        <div className="mw-slider-field__slider">
          <Slider
            {...sliderProps}
            id={id}
            ariaLabelledBy={labelId}
            {...(describedBy ? { ariaDescribedBy: describedBy } : {})}
            aria-invalid={hasError ? true : undefined}
            style={{ width: "100%", ...(sliderStyle ?? {}) }}
          />
        </div>

        {labelPosition === "inline" && showEdgeValues
          ? renderEdgeValue("max", maxValueLabel)
          : null}
      </div>

      {hasError && (
        <div className="mw-slider-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
