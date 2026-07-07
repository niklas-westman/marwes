import {
  Button,
  ButtonVariant,
  DialogModal,
  Drawer,
  Card as MwCard,
  Paragraph,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { CodeIconButton } from "../../components/CodeIconButton"
import { CodeSnippetModal } from "../../components/CodeSnippetModal"
import type { ComponentDisplayOptions } from "../playground-settings"
import { cardSnippets } from "./card-snippets"
import { dialogDrawerSnippets } from "./dialog-drawer-snippets"
import { FlexAreaCard, ShowcaseFlexRow, ShowcaseStack } from "./shared"

const LeftCard = styled(FlexAreaCard)`
  @container (max-width: 54rem) {
    flex-basis: 100%;
  }
`

const RightCard = styled(FlexAreaCard)`
  @container (max-width: 54rem) {
    flex-basis: 100%;
  }
`

type RowAvatarBreadcrumbDialogProps = {
  options: ComponentDisplayOptions
}

function RowAvatarBreadcrumbDialog({ options }: RowAvatarBreadcrumbDialogProps): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cardCodeOpen, setCardCodeOpen] = useState(false)
  const [dialogDrawerCodeOpen, setDialogDrawerCodeOpen] = useState(false)

  return (
    <ShowcaseFlexRow>
      <LeftCard $basis="36rem" $minHeight="12.625rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Card</Text>}
        <CodeIconButton ariaLabel="View Card code example" onClick={() => setCardCodeOpen(true)} />
        <MwCard title="Card title">
          {options.showDescriptions
            ? "Card description text goes here. This provides more context about the card content."
            : undefined}
        </MwCard>
      </LeftCard>
      <RightCard $basis="18.125rem" $minHeight="12.625rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Dialog &amp; Drawer</Text>}
        <CodeIconButton
          ariaLabel="View Dialog & Drawer code example"
          onClick={() => setDialogDrawerCodeOpen(true)}
        />
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
        description={
          options.showDescriptions
            ? "This is a dialog component from the Marwes design system."
            : undefined
        }
        footer={
          <Button variant={ButtonVariant.primary} onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        }
      >
        <Paragraph>Dialog content goes here. You can place any content inside.</Paragraph>
      </DialogModal>

      {drawerOpen && (
        <Drawer
          modal
          title="Drawer"
          description={
            options.showDescriptions
              ? "This is a drawer panel from the Marwes design system."
              : undefined
          }
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

      <CodeSnippetModal
        open={cardCodeOpen}
        onOpenChange={setCardCodeOpen}
        title="Card"
        snippets={cardSnippets}
      />
      <CodeSnippetModal
        open={dialogDrawerCodeOpen}
        onOpenChange={setDialogDrawerCodeOpen}
        title="Dialog & Drawer"
        snippets={dialogDrawerSnippets}
      />
    </ShowcaseFlexRow>
  )
}

export { RowAvatarBreadcrumbDialog }
