import type { CssVars, SliderOptions } from "@marwes-ui/core"
import { createSliderRecipe } from "@marwes-ui/core"
import * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"

type StyleWithVars = React.CSSProperties & CssVars

type NativeSliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "defaultValue" | "max" | "min" | "onChange" | "step" | "style" | "type" | "value"
>

export type SliderProps = SliderOptions &
  NativeSliderProps & {
    className?: string
    style?: React.CSSProperties
    onValueChange?: (value: number) => void
    onChange?: React.ChangeEventHandler<HTMLInputElement>
  }

type SliderOptionDraft = {
  [Key in keyof SliderOptions]?: SliderOptions[Key] | undefined
}

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
  if (options.orientation !== undefined) sliderOptions.orientation = options.orientation
  if (options.ariaLabel !== undefined) sliderOptions.ariaLabel = options.ariaLabel
  if (options.ariaLabelledBy !== undefined) sliderOptions.ariaLabelledBy = options.ariaLabelledBy
  if (options.ariaDescribedBy !== undefined) sliderOptions.ariaDescribedBy = options.ariaDescribedBy
  if (options.ariaValueText !== undefined) sliderOptions.ariaValueText = options.ariaValueText

  return sliderOptions
}

function resolveSliderValue(options: SliderOptionDraft): number {
  return createSliderRecipe(buildSliderOptions(options)).value
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const {
    id,
    name,
    min,
    max,
    step,
    value,
    defaultValue,
    disabled,
    required,
    showTooltip,
    showTouchArea,
    orientation,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaValueText,
    className: customClassName,
    style: customStyle,
    onValueChange,
    onChange,
    ...inputProps
  } = props

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    resolveSliderValue({ min, max, step, value, defaultValue }),
  )

  React.useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue(resolveSliderValue({ min, max, step, defaultValue }))
    }
  }, [defaultValue, isControlled, max, min, step])

  const currentValue = isControlled
    ? resolveSliderValue({ min, max, step, value })
    : uncontrolledValue

  const kit = createSliderRecipe(
    buildSliderOptions({
      id,
      name,
      min,
      max,
      step,
      value: currentValue,
      disabled,
      required,
      showTooltip,
      showTouchArea,
      orientation,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      ariaValueText,
    }),
  )

  useRenderKitDebug(kit, "Slider")

  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className
  const style = { ...(kit.vars as StyleWithVars), ...customStyle }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const nextValue = Number(event.currentTarget.value)

    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    onChange?.(event)
    onValueChange?.(nextValue)
  }

  return (
    <div className={className} style={style} {...kit.dataAttributes}>
      <div className="mw-slider__control">
        <input
          {...inputProps}
          ref={ref}
          type={kit.a11y.type}
          id={kit.a11y.id}
          name={kit.a11y.name}
          min={kit.a11y.min}
          max={kit.a11y.max}
          step={kit.a11y.step}
          disabled={kit.a11y.disabled === true}
          required={kit.a11y.required === true}
          aria-label={kit.a11y.ariaLabel}
          aria-labelledby={kit.a11y.ariaLabelledBy}
          aria-describedby={kit.a11y.ariaDescribedBy}
          aria-valuetext={kit.a11y.ariaValueText}
          aria-orientation={kit.a11y.ariaOrientation}
          className={kit.inputClassName}
          value={currentValue}
          onChange={handleChange}
        />

        <div className="mw-slider__visual" aria-hidden="true">
          <span className="mw-slider__track" />
          <span className="mw-slider__fill" />
          <span className="mw-slider__touch-area" />
          <span className="mw-slider__thumb" />
        </div>

        {kit.showTooltip ? (
          <span className="mw-slider__tooltip" aria-hidden="true">
            {currentValue}
          </span>
        ) : null}
      </div>
    </div>
  )
})

Slider.displayName = "Slider"
