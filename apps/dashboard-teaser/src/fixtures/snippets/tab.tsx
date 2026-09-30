import { NavigationTabs } from "@marwes-ui/react"

const tabs = [
  { value: "overview", label: "Overview", panel: "Account overview" },
  { value: "activity", label: "Activity", panel: "Recent account activity" },
]

export function Example() {
  return <NavigationTabs label="Account" tabs={tabs} defaultActiveTab="overview" />
}
