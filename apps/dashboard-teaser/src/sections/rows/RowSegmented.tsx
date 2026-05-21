import { Icon, IconName, SegmentedControl } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard } from "./shared"

const RowContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const ItemCard = styled(FlexCard)``

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const DemoArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
    <RowContainer>
      <ItemCard>
        <SectionLabel>Segmented button – Inverse</SectionLabel>
        <DemoArea>
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
        </DemoArea>
      </ItemCard>
      <ItemCard>
        <SectionLabel>Segmented button – Default</SectionLabel>
        <DemoArea>
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
        </DemoArea>
      </ItemCard>
    </RowContainer>
  )
}

export { RowSegmented }
