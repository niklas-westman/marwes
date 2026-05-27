import {
  Button,
  ButtonVariant,
  DialogModal,
  Drawer,
  Card as MwCard,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow, ShowcaseSectionLabel, ShowcaseStack } from "./shared"

const LeftCard = styled(FlexCard)``

const RightCard = styled(FlexCard)`
  max-width: 18.125rem;
`

function RowAvatarBreadcrumbDialog(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <ShowcaseRow>
      <LeftCard>
        <Text variant={TextVariant.overline}>Card</Text>

        <MwCard title="Card title">
          Card description text goes here. This provides more context about the card content.
        </MwCard>
      </LeftCard>
      <RightCard>
        <Text variant={TextVariant.overline}>Dialog &amp; Drawer</Text>

        <ShowcaseStack>
          <Button variant={ButtonVariant.primary} onClick={() => setDialogOpen(true)}>
            Open dialog →
          </Button>
          <Button variant={ButtonVariant.secondary} onClick={() => setDrawerOpen(true)}>
            Open drawer →
          </Button>
        </ShowcaseStack>
      </RightCard>

      <DialogModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Dialog title"
        description="This is a dialog component from the Marwes design system."
        portalTarget={null}
        footer={
          <Button variant={ButtonVariant.primary} onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        }
      >
        <p>Dialog content goes here. You can place any content inside.</p>
      </DialogModal>

      {drawerOpen && (
        <Drawer
          modal
          title="Drawer"
          description="This is a drawer panel from the Marwes design system."
          size="medium"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          footer={
            <Button variant={ButtonVariant.secondary} onClick={() => setDrawerOpen(false)}>
              Close drawer
            </Button>
          }
        >
          <p>Drawer content goes here. Use it for filters, detail panels, or secondary flows.</p>
        </Drawer>
      )}
    </ShowcaseRow>
  )
}

export { RowAvatarBreadcrumbDialog }
