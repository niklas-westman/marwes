import { Button, ButtonVariant, Drawer } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseStack } from "./showcase-layout"

function DrawerShowcase(): JSX.Element {
  const [rightOpen, setRightOpen] = useState(false)
  const [leftOpen, setLeftOpen] = useState(false)
  const [largeOpen, setLargeOpen] = useState(false)

  return (
    <ShowcaseStack>
      <ShowcaseCard>
        <h3>Right placement</h3>
        <p>Mounted only while open, sliding in from the trailing edge of the screen.</p>
        <Button variant={ButtonVariant.primary} onClick={() => setRightOpen(true)}>
          Open right drawer
        </Button>
        {rightOpen && (
          <Drawer
            modal
            title="Notification settings"
            size="medium"
            placement="right"
            onClose={() => setRightOpen(false)}
            footer={
              <Button variant={ButtonVariant.secondary} onClick={() => setRightOpen(false)}>
                Close
              </Button>
            }
          >
            <p>Choose which alerts to receive and how.</p>
          </Drawer>
        )}
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Left placement, compact size</h3>
        <p>The opposite edge and a smaller size fit a lighter-weight panel.</p>
        <Button variant={ButtonVariant.secondary} onClick={() => setLeftOpen(true)}>
          Open left drawer
        </Button>
        {leftOpen && (
          <Drawer
            modal
            title="Filters"
            size="small"
            placement="left"
            onClose={() => setLeftOpen(false)}
            footer={
              <Button variant={ButtonVariant.secondary} onClick={() => setLeftOpen(false)}>
                Close
              </Button>
            }
          >
            <p>Narrow results by status, owner, and date.</p>
          </Drawer>
        )}
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Large size, no scrim</h3>
        <p>A wider panel without a dimmed background for lighter-weight side content.</p>
        <Button variant={ButtonVariant.secondary} onClick={() => setLargeOpen(true)}>
          Open large drawer
        </Button>
        {largeOpen && (
          <Drawer
            title="Activity log"
            size="large"
            placement="right"
            showScrim={false}
            onClose={() => setLargeOpen(false)}
            footer={
              <Button variant={ButtonVariant.secondary} onClick={() => setLargeOpen(false)}>
                Close
              </Button>
            }
          >
            <p>A running list of recent changes to this record.</p>
          </Drawer>
        )}
      </ShowcaseCard>
    </ShowcaseStack>
  )
}

export default DrawerShowcase
