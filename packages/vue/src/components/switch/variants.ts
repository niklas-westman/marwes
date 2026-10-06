import { defineComponent, h } from "vue"
import { definePropKeys } from "../../internal/prop-keys"
import { SwitchField, type SwitchFieldProps } from "./switch-field"

const switchFieldPropKeys = definePropKeys<SwitchFieldProps>()([
  "id",
  "label",
  "description",
  "error",
  "switch",
  "ariaDescribedBy",
  "dataAttributes",
  "modelValue",
])

export type FeatureToggleProps = SwitchFieldProps

export const FeatureToggle = defineComponent({
  name: "MarwesFeatureToggle",
  inheritAttrs: false,
  props: [...switchFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as FeatureToggleProps

    return () =>
      h(
        SwitchField,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "feature-toggle",
          },
        },
        slots,
      )
  },
})

export type PreferenceSwitchProps = SwitchFieldProps

export const PreferenceSwitch = defineComponent({
  name: "MarwesPreferenceSwitch",
  inheritAttrs: false,
  props: [...switchFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as PreferenceSwitchProps

    return () =>
      h(
        SwitchField,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "preference",
          },
        },
        slots,
      )
  },
})

export type PermissionSwitchProps = SwitchFieldProps

export const PermissionSwitch = defineComponent({
  name: "MarwesPermissionSwitch",
  inheritAttrs: false,
  props: [...switchFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as PermissionSwitchProps

    return () =>
      h(
        SwitchField,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "permission",
          },
        },
        slots,
      )
  },
})
