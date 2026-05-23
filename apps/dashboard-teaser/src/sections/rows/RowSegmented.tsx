import { Icon, IconName, SegmentedControl } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow, ShowcaseSectionLabel, ShowcaseStack } from "./shared"

const ItemCard = styled(FlexCard)``

const FullWidthSegmentedControl = styled(SegmentedControl)`
  width: 100%;
  inline-size: 100%;
`

const inverseTwo: SegmentedControlItem[] = [
  { value: "compact", label: "Compact" },
  { value: "wide", label: "Wide" },
]

const inverseThree: SegmentedControlItem[] = [
  { value: "compact", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Compact" },
  { value: "wide", icon: <Icon name={IconName.Settings} decorative size={12} />, label: "Wide" },
  { value: "rich", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Rich" },
]

const inverseIcon: SegmentedControlItem[] = [
  {
    value: "light",
    icon: <Icon name={IconName.Sun} decorative size={12} />,
    ariaLabel: "Light mode",
  },
  {
    value: "dark",
    icon: <Icon name={IconName.Moon} decorative size={12} />,
    ariaLabel: "Dark mode",
  },
]

const defaultTwo: SegmentedControlItem[] = [
  { value: "compact", label: "Compact" },
  { value: "wide", label: "Wide" },
]

const defaultThree: SegmentedControlItem[] = [
  { value: "compact", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Compact" },
  { value: "wide", icon: <Icon name={IconName.Settings} decorative size={12} />, label: "Wide" },
  { value: "rich", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Rich" },
]

const defaultIcon: SegmentedControlItem[] = [
  {
    value: "light",
    icon: <Icon name={IconName.Sun} decorative size={12} />,
    ariaLabel: "Light mode",
  },
  {
    value: "dark",
    icon: <Icon name={IconName.Moon} decorative size={12} />,
    ariaLabel: "Dark mode",
  },
]

function RowSegmented(): JSX.Element {
  const [state, setState] = useState({
    inverseTwo: "compact",
    inverseThree: "compact",
    inverseIcon: "light",
    defaultTwo: "compact",
    defaultThree: "compact",
    defaultIcon: "light",
  })

  const set = (key: string, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ShowcaseRow>
      <ItemCard>
        <ShowcaseSectionLabel>Segmented button – Inverse</ShowcaseSectionLabel>
        <ShowcaseStack>
          <FullWidthSegmentedControl
            items={inverseTwo}
            value={state.inverseTwo}
            onValueChange={(v) => set("inverseTwo", v)}
            variant="inverse"
            ariaLabel="View density inverse"
          />
          <FullWidthSegmentedControl
            items={inverseThree}
            value={state.inverseThree}
            onValueChange={(v) => set("inverseThree", v)}
            variant="inverse"
            ariaLabel="View mode inverse"
          />
          <SegmentedControl
            items={inverseIcon}
            value={state.inverseIcon}
            onValueChange={(v) => set("inverseIcon", v)}
            variant="inverse"
            size="sm"
            ariaLabel="Icon toggle inverse"
          />
        </ShowcaseStack>
      </ItemCard>
      <ItemCard>
        <ShowcaseSectionLabel>Segmented button – Default</ShowcaseSectionLabel>
        <ShowcaseStack>
          <FullWidthSegmentedControl
            items={defaultTwo}
            value={state.defaultTwo}
            onValueChange={(v) => set("defaultTwo", v)}
            ariaLabel="View density"
          />
          <FullWidthSegmentedControl
            items={defaultThree}
            value={state.defaultThree}
            onValueChange={(v) => set("defaultThree", v)}
            ariaLabel="View mode"
          />
          <SegmentedControl
            items={defaultIcon}
            value={state.defaultIcon}
            onValueChange={(v) => set("defaultIcon", v)}
            size="sm"
            ariaLabel="Icon toggle"
          />
        </ShowcaseStack>
      </ItemCard>
    </ShowcaseRow>
  )
}

export { RowSegmented }
