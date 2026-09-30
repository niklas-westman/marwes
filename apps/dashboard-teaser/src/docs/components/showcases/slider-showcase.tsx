import { RadiusSlider, SliderField, VolumeSlider } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function SliderShowcase(): JSX.Element {
  const [zoom, setZoom] = useState(60)
  const [volume, setVolume] = useState(72)
  const [radius, setRadius] = useState(8)

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Custom range</h3>
        <p>A base slider for a value that does not fit an existing purpose wrapper.</p>
        <ShowcaseStack>
          <SliderField
            label="Zoom level"
            minValueLabel="50%"
            maxValueLabel="200%"
            slider={{
              min: 50,
              max: 200,
              step: 5,
              value: zoom,
              showTooltip: true,
              onValueChange: setZoom,
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Volume control</h3>
        <p>A preconfigured 0-100 range with matching min/max labels and a value tooltip.</p>
        <ShowcaseStack>
          <VolumeSlider slider={{ value: volume, onValueChange: setVolume }} />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Radius control</h3>
        <p>
          A preconfigured pixel range keeps the step and bounds consistent everywhere it appears.
        </p>
        <ShowcaseStack>
          <RadiusSlider slider={{ value: radius, onValueChange: setRadius }} />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default SliderShowcase
