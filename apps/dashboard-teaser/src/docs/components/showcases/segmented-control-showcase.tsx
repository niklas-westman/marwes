import { Icon, IconName, SegmentedControlField } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function SegmentedControlShowcase(): JSX.Element {
  const [density, setDensity] = useState("compact")
  const [mode, setMode] = useState("compact")
  const [theme, setTheme] = useState("light")

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Label-only filter</h3>
        <p>A small set of mutually exclusive views stays visible at once.</p>
        <ShowcaseStack>
          <SegmentedControlField
            label="View density"
            segmentedControl={{
              items: [
                { value: "compact", label: "Compact" },
                { value: "wide", label: "Wide" },
              ],
              value: density,
              onValueChange: setDensity,
              fullWidth: true,
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Icon and label</h3>
        <p>A decorative icon reinforces the visible text label for each segment.</p>
        <ShowcaseStack>
          <SegmentedControlField
            label="View mode"
            segmentedControl={{
              items: [
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
              ],
              value: mode,
              onValueChange: setMode,
              fullWidth: true,
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Icon-only</h3>
        <p>Every icon-only segment carries a truthful ariaLabel since no visible text remains.</p>
        <ShowcaseStack>
          <SegmentedControlField
            label="Theme"
            segmentedControl={{
              items: [
                {
                  value: "light",
                  icon: <Icon name={IconName.Sun} decorative size={12} />,
                  ariaLabel: "Light",
                },
                {
                  value: "dark",
                  icon: <Icon name={IconName.Moon} decorative size={12} />,
                  ariaLabel: "Dark",
                },
              ],
              value: theme,
              onValueChange: setTheme,
              size: "sm",
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default SegmentedControlShowcase
