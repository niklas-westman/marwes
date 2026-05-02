import { buildSwitchFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Switch, type SwitchProps } from "./switch"

export type SwitchFieldProps = {
  id?: string
  label: string
  description?: string
  error?: string
  switch?: SwitchProps
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string>
  modelValue?: boolean
}

const switchFieldPropKeys = [
  "id",
  "label",
  "description",
  "error",
  "switch",
  "ariaDescribedBy",
  "dataAttributes",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const SwitchField = defineComponent(
  (props: SwitchFieldProps, { slots, emit }) => {
    const localSwitchId = createLocalId("mw-switch")
    const id = computed(() => props.id ?? localSwitchId)
    const sourceSwitch = computed<SwitchProps>(() => props.switch ?? {})
    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))
    const a11yIds = computed(() =>
      buildSwitchFieldA11yIds({
        id: id.value,
        hasDescription: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const disabled = computed(() => sourceSwitch.value.disabled || false)
    const invalid = computed(() => hasError.value)
    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-switch-field",
        disabled.value && "mw-switch-field--disabled",
        invalid.value && "mw-switch-field--invalid",
      ),
    )

    const mergedSwitchProps = computed<SwitchProps>(() => {
      const {
        ariaLabel: _ignoredAriaLabel,
        ariaLabelledby: _ignoredAriaLabelledby,
        ariaDescribedBy: _ignoredAriaDescribedBy,
        onCheckedChange: originalOnCheckedChange,
        ...restSwitchProps
      } = sourceSwitch.value
      const nextSwitchProps: SwitchProps = {
        ...restSwitchProps,
        id: id.value,
        ariaLabelledby: a11yIds.value.labelId,
      }

      if (props.modelValue !== undefined) {
        nextSwitchProps.modelValue = props.modelValue
      }

      if (a11yIds.value.describedBy) {
        nextSwitchProps.ariaDescribedBy = a11yIds.value.describedBy
      }

      nextSwitchProps.onCheckedChange = (nextChecked: boolean) => {
        originalOnCheckedChange?.(nextChecked)
        emit("update:modelValue", nextChecked)
        emit("checked-change", nextChecked)
      }

      return nextSwitchProps
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
          h("div", { class: "mw-switch-field__row" }, [
            h(Switch, mergedSwitchProps.value),
            h("span", { class: "mw-switch-field__label", id: a11yIds.value.labelId }, [
              h(Paragraph, { size: "md" }, { default: labelContent }),
            ]),
          ]),

          hasDescription.value
            ? h("div", { class: "mw-switch-field__description", id: a11yIds.value.descriptionId }, [
                h(Paragraph, { size: "sm" }, { default: descriptionContent }),
              ])
            : null,

          hasError.value
            ? h(
                "div",
                {
                  class: "mw-switch-field__error",
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
    name: "MarwesSwitchField",
    props: [...switchFieldPropKeys],
    emits: ["update:modelValue", "checked-change"],
  },
)
