import { Button, DialogModal, Drawer, Card as MwCard } from "@marwes-ui/react"
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

const LeftCard = styled(FlexCard)``

const RightCard = styled(FlexCard)`
  max-width: 290px;
`

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

function RowAvatarBreadcrumbDialog(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <RowContainer>
      <LeftCard>
        <SectionLabel>Card</SectionLabel>
        <MwCard title="Card title">
          Card description text goes here. This provides more context about the card content.
        </MwCard>
      </LeftCard>
      <RightCard>
        <SectionLabel>Dialog &amp; Drawer</SectionLabel>
        <ButtonStack>
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open dialog →
          </Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open drawer →
          </Button>
        </ButtonStack>
      </RightCard>

      <DialogModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Dialog title"
        description="This is a dialog component from the Marwes design system."
        portalTarget={null}
        footer={
          <Button variant="primary" onClick={() => setDialogOpen(false)}>
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
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Close drawer
            </Button>
          }
        >
          <p>Drawer content goes here. Use it for filters, detail panels, or secondary flows.</p>
        </Drawer>
      )}
    </RowContainer>
  )
}

export { RowAvatarBreadcrumbDialog }
