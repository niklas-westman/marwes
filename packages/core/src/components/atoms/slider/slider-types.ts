import type { CssVars } from "../../../shared/css-vars"

export interface SliderOptions {
  id?: string
  name?: string
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  disabled?: boolean
  required?: boolean
  showTooltip?: boolean
  showTouchArea?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaValueText?: string
}

export interface SliderA11yProps {
  type: "range"
  id?: string
  name?: string
  min: number
  max: number
  step: number
  disabled?: true
  required?: true
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaValueText?: string
}

export interface SliderDataAttributes {
  "data-component": "slider"
  "data-show-tooltip"?: "true"
  "data-show-touch-area"?: "true"
}

export interface SliderRenderKit {
  tag: "div"
  className: string
  inputClassName: string
  vars: CssVars
  a11y: SliderA11yProps
  dataAttributes: SliderDataAttributes
  value: number
  showTooltip: boolean
  showTouchArea: boolean
}
