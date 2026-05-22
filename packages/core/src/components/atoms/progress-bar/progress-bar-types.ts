import type { CssVars } from "../../../shared/css-vars"

export const ProgressBarSize = {
  small: "small",
  default: "default",
} as const
export type ProgressBarSize = (typeof ProgressBarSize)[keyof typeof ProgressBarSize]

export const progressBarSizes = Object.values(ProgressBarSize) as ProgressBarSize[]

export const ProgressBarState = {
  default: "default",
  hover: "hover",
  pressed: "pressed",
  focus: "focus",
} as const
export type ProgressBarState = (typeof ProgressBarState)[keyof typeof ProgressBarState]

export const progressBarStates = Object.values(ProgressBarState) as ProgressBarState[]

export interface ProgressBarOptions {
  id?: string
  label?: string
  value?: number
  min?: number
  max?: number
  size?: ProgressBarSize
  state?: ProgressBarState
  disabled?: boolean
  showLabel?: boolean
  showPercentage?: boolean
  valueLabel?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export interface ProgressBarA11yProps {
  id?: string
  role: "progressbar"
  ariaValueMin: number
  ariaValueMax: number
  ariaValueNow: number
  ariaValueText?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaDisabled?: true
}

export interface ProgressBarDataAttributes {
  "data-component": "progress-bar"
  "data-size": ProgressBarSize
  "data-state": ProgressBarState
  "data-disabled"?: "true"
}

export interface ProgressBarRenderKit {
  tag: "div"
  className: string
  trackClassName: string
  fillClassName: string
  labelClassName: string
  percentageClassName: string
  labelId?: string
  vars: CssVars
  a11y: ProgressBarA11yProps
  dataAttributes: ProgressBarDataAttributes
  label: string
  percentageLabel: string
  value: number
  min: number
  max: number
  percentage: number
  size: ProgressBarSize
  state: ProgressBarState
  showLabel: boolean
  showPercentage: boolean
}
