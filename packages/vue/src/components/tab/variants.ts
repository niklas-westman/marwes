import { defineComponent, h } from "vue"
import { TabGroup, type TabGroupProps } from "./tab-group"

const tabGroupPropKeys = [
  "id",
  "label",
  "ariaLabel",
  "tabs",
  "activeTab",
  "defaultActiveTab",
  "dataAttributes",
  "className",
] as const

export type NavigationTabsProps = TabGroupProps

export const NavigationTabs = defineComponent({
  name: "MarwesNavigationTabs",
  inheritAttrs: false,
  props: [...tabGroupPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as NavigationTabsProps

    return () =>
      h(
        TabGroup,
        {
          ...attrs,
          ...props,
          ariaLabel: props.ariaLabel ?? "Navigation tabs",
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "navigation-tabs",
          },
        },
        slots,
      )
  },
})

export type ContentTabsProps = TabGroupProps

export const ContentTabs = defineComponent({
  name: "MarwesContentTabs",
  inheritAttrs: false,
  props: [...tabGroupPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as ContentTabsProps

    return () =>
      h(
        TabGroup,
        {
          ...attrs,
          ...props,
          ariaLabel: props.ariaLabel ?? "Content tabs",
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "content-tabs",
          },
        },
        slots,
      )
  },
})

export type SettingsTabsProps = TabGroupProps

export const SettingsTabs = defineComponent({
  name: "MarwesSettingsTabs",
  inheritAttrs: false,
  props: [...tabGroupPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as SettingsTabsProps

    return () =>
      h(
        TabGroup,
        {
          ...attrs,
          ...props,
          ariaLabel: props.ariaLabel ?? "Settings tabs",
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "settings-tabs",
          },
        },
        slots,
      )
  },
})
