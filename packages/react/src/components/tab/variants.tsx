import type * as React from "react"
import { TabGroup, type TabGroupProps } from "./tab-group"

export type NavigationTabsProps = TabGroupProps

export function NavigationTabs(props: NavigationTabsProps): React.ReactElement {
  return (
    <TabGroup
      {...props}
      ariaLabel={props.ariaLabel ?? "Navigation tabs"}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "navigation-tabs",
      }}
    />
  )
}

export type ContentTabsProps = TabGroupProps

export function ContentTabs(props: ContentTabsProps): React.ReactElement {
  return (
    <TabGroup
      {...props}
      ariaLabel={props.ariaLabel ?? "Content tabs"}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "content-tabs",
      }}
    />
  )
}

export type SettingsTabsProps = TabGroupProps

export function SettingsTabs(props: SettingsTabsProps): React.ReactElement {
  return (
    <TabGroup
      {...props}
      ariaLabel={props.ariaLabel ?? "Settings tabs"}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "settings-tabs",
      }}
    />
  )
}
