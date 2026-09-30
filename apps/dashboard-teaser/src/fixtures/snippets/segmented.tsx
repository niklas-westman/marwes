import { Icon, IconName, SegmentedControlField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [density, setDensity] = useState("compact")
  const [mode, setMode] = useState("compact")
  const [theme, setTheme] = useState("light")

  return (
    <>
      <SegmentedControlField
        label="View density"
        segmentedControl={{
          items: [
            { value: "compact", label: "Compact" },
            { value: "wide", label: "Wide" },
          ],
          value: density,
          onValueChange: setDensity,
          variant: "inverse",
          fullWidth: true,
        }}
      />
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
            {
              value: "rich",
              icon: <Icon name={IconName.Star} decorative size={12} />,
              label: "Rich",
            },
          ],
          value: mode,
          onValueChange: setMode,
          variant: "inverse",
          fullWidth: true,
        }}
      />
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
          variant: "inverse",
          size: "sm",
        }}
      />
    </>
  )
}
