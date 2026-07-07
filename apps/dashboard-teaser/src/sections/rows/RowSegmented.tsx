import { Icon, IconName, Text, TextVariant } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"
// Atom is no longer publicly exported; deep-import for the showcase row.
import { SegmentedControl } from "../../../../../packages/react/src/components/segmented-control/segmented-control"

import { CodeIconButton } from "../../components/CodeIconButton"
import { CodeSnippetModal } from "../../components/CodeSnippetModal"
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
  const [inverseCodeOpen, setInverseCodeOpen] = useState(false)
  const [defaultCodeOpen, setDefaultCodeOpen] = useState(false)

  const set = (key: string, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ShowcaseFlexRow>
      <ItemCard $basis="24rem" $minHeight="15.75rem">
        <Text variant={TextVariant.overline}>Segmented button – Inverse</Text>
        <CodeIconButton
          ariaLabel="View Segmented (inverse) code example"
          onClick={() => setInverseCodeOpen(true)}
        />
        <ShowcaseStack>
          <SegmentedControl
            items={inverseTwo}
            value={state.inverseTwo}
            onValueChange={(v) => set("inverseTwo", v)}
            variant="inverse"
            ariaLabel="View density inverse"
            fullWidth
          />
          <SegmentedControl
            items={inverseThree}
            value={state.inverseThree}
            onValueChange={(v) => set("inverseThree", v)}
            variant="inverse"
            ariaLabel="View mode inverse"
            fullWidth
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
      <ItemCard $basis="24rem" $minHeight="15.75rem">
        <Text variant={TextVariant.overline}>Segmented button – Default</Text>
        <CodeIconButton
          ariaLabel="View Segmented (default) code example"
          onClick={() => setDefaultCodeOpen(true)}
        />
        <ShowcaseStack>
          <SegmentedControl
            items={defaultTwo}
            value={state.defaultTwo}
            onValueChange={(v) => set("defaultTwo", v)}
            ariaLabel="View density"
            fullWidth
          />
          <SegmentedControl
            items={defaultThree}
            value={state.defaultThree}
            onValueChange={(v) => set("defaultThree", v)}
            ariaLabel="View mode"
            fullWidth
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
      <CodeSnippetModal
        open={inverseCodeOpen}
        onOpenChange={setInverseCodeOpen}
        title="Segmented button – Inverse"
        snippets={segmentedSnippets}
      />
      <CodeSnippetModal
        open={defaultCodeOpen}
        onOpenChange={setDefaultCodeOpen}
        title="Segmented button – Default"
        snippets={segmentedSnippets}
      />
    </ShowcaseFlexRow>
  )
}

export { RowSegmented }
