import { Icon, IconName, SegmentedControlField, Text, TextVariant } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { memo, useState } from "react"
import styled from "styled-components"

import { SnippetButton } from "../../components/SnippetButton"
import { segmentedSnippets } from "./segmented-snippets"
import { FlexAreaCard, ShowcaseFlexRow, ShowcaseStack } from "./shared"

const ItemCard = styled(FlexAreaCard)``

const inverseTwo: SegmentedControlItem[] = [
  { value: "compact", label: "Compact" },
  { value: "wide", label: "Wide" },
]

const inverseThree: SegmentedControlItem[] = [
  {
    value: "compact",
    icon: <Icon name={IconName.Star} decorative size={12} />,
    label: "Compact",
  },
  {
    value: "wide",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    label: "Wide",
  },
  {
    value: "rich",
    icon: <Icon name={IconName.Star} decorative size={12} />,
    label: "Rich",
  },
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
  {
    value: "compact",
    icon: <Icon name={IconName.Star} decorative size={12} />,
    label: "Compact",
  },
  {
    value: "wide",
    icon: <Icon name={IconName.Settings} decorative size={12} />,
    label: "Wide",
  },
  {
    value: "rich",
    icon: <Icon name={IconName.Star} decorative size={12} />,
    label: "Rich",
  },
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
    <ShowcaseFlexRow>
      <ItemCard $basis="24rem" $minHeight="15.75rem">
        <Text variant={TextVariant.overline}>Segmented button – Inverse</Text>
        <SnippetButton title="Segmented button – Inverse" snippets={segmentedSnippets} />
        <ShowcaseStack>
          <SegmentedControlField
            label="View density"
            segmentedControl={{
              items: inverseTwo,
              value: state.inverseTwo,
              onValueChange: (v) => set("inverseTwo", v),
              variant: "inverse",
              fullWidth: true,
            }}
          />
          <SegmentedControlField
            label="View mode"
            segmentedControl={{
              items: inverseThree,
              value: state.inverseThree,
              onValueChange: (v) => set("inverseThree", v),
              variant: "inverse",
              fullWidth: true,
            }}
          />
          <SegmentedControlField
            label="Theme"
            segmentedControl={{
              items: inverseIcon,
              value: state.inverseIcon,
              onValueChange: (v) => set("inverseIcon", v),
              variant: "inverse",
              size: "sm",
            }}
          />
        </ShowcaseStack>
      </ItemCard>
      <ItemCard $basis="24rem" $minHeight="15.75rem">
        <Text variant={TextVariant.overline}>Segmented button – Default</Text>
        <SnippetButton title="Segmented button – Default" snippets={segmentedSnippets} />
        <ShowcaseStack>
          <SegmentedControlField
            label="View density"
            segmentedControl={{
              items: defaultTwo,
              value: state.defaultTwo,
              onValueChange: (v) => set("defaultTwo", v),
              fullWidth: true,
            }}
          />
          <SegmentedControlField
            label="View mode"
            segmentedControl={{
              items: defaultThree,
              value: state.defaultThree,
              onValueChange: (v) => set("defaultThree", v),
              fullWidth: true,
            }}
          />
          <SegmentedControlField
            label="Theme"
            segmentedControl={{
              items: defaultIcon,
              value: state.defaultIcon,
              onValueChange: (v) => set("defaultIcon", v),
              size: "sm",
            }}
          />
        </ShowcaseStack>
      </ItemCard>
    </ShowcaseFlexRow>
  )
}

const MemoizedRowSegmented = memo(RowSegmented)
export { MemoizedRowSegmented as RowSegmented }
