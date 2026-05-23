import { Icon, IconName, SegmentedControl } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow, ShowcaseSectionLabel, ShowcaseStack } from "./shared"

const ItemCard = styled(FlexCard)``

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
    value: "a",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    ariaLabel: "Option A",
  },
  {
    value: "b",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    ariaLabel: "Option B",
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
    value: "a",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    ariaLabel: "Option A",
  },
  {
    value: "b",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    ariaLabel: "Option B",
  },
]

function RowSegmented(): JSX.Element {
  const [state, setState] = useState({
    inverseTwo: "compact",
    inverseThree: "compact",
    inverseIcon: "a",
    defaultTwo: "compact",
    defaultThree: "compact",
    defaultIcon: "a",
  })

  const set = (key: string, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ShowcaseRow>
      <ItemCard>
        <ShowcaseSectionLabel>Segmented button – Inverse</ShowcaseSectionLabel>
        <ShowcaseStack>
          <SegmentedControl
            items={inverseTwo}
            value={state.inverseTwo}
            onValueChange={(v) => set("inverseTwo", v)}
            variant="inverse"
            ariaLabel="View density inverse"
          />
          <SegmentedControl
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
          <SegmentedControl
            items={defaultTwo}
            value={state.defaultTwo}
            onValueChange={(v) => set("defaultTwo", v)}
            ariaLabel="View density"
          />
          <SegmentedControl
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
