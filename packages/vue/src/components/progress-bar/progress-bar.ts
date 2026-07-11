import { type CssVars, type ProgressBarOptions, createProgressBarRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type ProgressBarProps = ProgressBarOptions & {
  className?: string
  dataAttributes?: Record<string, string>
}

const progressBarPropKeys = [
  "id",
  "label",
  "value",
  "min",
  "max",
  "size",
  "state",
  "disabled",
  "showLabel",
  "showPercentage",
  "valueLabel",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "className",
  "dataAttributes",
] as const

export const ProgressBar = defineComponent(
  (props: ProgressBarProps) => {
    const attrs = useAttrs()
    const ariaLabelFromAttrs =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined

    const renderKit = computed(() =>
      createProgressBarRecipe({
        ...(props.id !== undefined ? { id: props.id } : {}),
        ...(props.label !== undefined ? { label: props.label } : {}),
        ...(props.value !== undefined ? { value: props.value } : {}),
        ...(props.min !== undefined ? { min: props.min } : {}),
        ...(props.max !== undefined ? { max: props.max } : {}),
        ...(props.size !== undefined ? { size: props.size } : {}),
        ...(props.state !== undefined ? { state: props.state } : {}),
        ...(props.disabled !== undefined ? { disabled: props.disabled } : {}),
        ...(props.showLabel !== undefined ? { showLabel: props.showLabel } : {}),
        ...(props.showPercentage !== undefined ? { showPercentage: props.showPercentage } : {}),
        ...(props.valueLabel !== undefined ? { valueLabel: props.valueLabel } : {}),
        ...(props.ariaLabel !== undefined
          ? { ariaLabel: props.ariaLabel }
          : ariaLabelFromAttrs !== undefined
            ? { ariaLabel: ariaLabelFromAttrs }
            : {}),
        ...(props.ariaLabelledBy !== undefined ? { ariaLabelledBy: props.ariaLabelledBy } : {}),
        ...(props.ariaDescribedBy !== undefined ? { ariaDescribedBy: props.ariaDescribedBy } : {}),
      }),
    )

    return () => {
      const kit = renderKit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, [
        "class",
        "style",
        "aria-label",
      ])
      const hasLabelRow = kit.showLabel || kit.showPercentage

      return h(
        "div",
        {
          ...passthroughAttrs,
          ...kit.dataAttributes,
          ...(props.dataAttributes ?? {}),
          id: kit.a11y.id,
          role: kit.a11y.role,
          "aria-valuemin": kit.a11y.ariaValueMin,
          "aria-valuemax": kit.a11y.ariaValueMax,
          "aria-valuenow": kit.a11y.ariaValueNow,
          "aria-valuetext": kit.a11y.ariaValueText,
          "aria-label": kit.a11y.ariaLabel,
          "aria-labelledby": kit.a11y.ariaLabelledBy,
          "aria-describedby": kit.a11y.ariaDescribedBy,
          "aria-disabled": kit.a11y.ariaDisabled ? "true" : undefined,
          class: mergeClassNames(kit.className, props.className, attrs.class),
          style: mergeStyles(kit.vars as CssVars, attrs.style),
        },
        [
          hasLabelRow
            ? h("div", { class: "mw-progress-bar__label-row" }, [
                kit.showLabel
                  ? h("span", { id: kit.labelId, class: kit.labelClassName }, kit.label)
                  : null,
                kit.showPercentage
                  ? h("span", { class: kit.percentageClassName }, kit.percentageLabel)
                  : null,
              ])
            : null,
          h("div", { class: kit.trackClassName, "aria-hidden": "true" }, [
            h("span", { class: kit.fillClassName }),
          ]),
        ],
      )
    }
  },
  {
    name: "MarwesProgressBar",
    inheritAttrs: false,
    props: [...progressBarPropKeys],
  },
)
