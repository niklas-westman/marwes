import {
  Button,
  ButtonVariant,
  DialogModal,
  Drawer,
  H1,
  H2,
  H3,
  Paragraph,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { memo, useState } from "react"
import styled from "styled-components"

import { SnippetButton } from "../../components/SnippetButton"
import type { ComponentDisplayOptions } from "../playground-settings"
import { dialogDrawerSnippets } from "./dialog-drawer-snippets"
import { FlexAreaCard, ShowcaseFlexRow, ShowcaseStack } from "./shared"
import { typographySnippets } from "./typography-snippets"

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

const TypographyGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
`

const TypographyGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const GroupLabel = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.textMuted};
`

type RowAvatarBreadcrumbDialogProps = {
  options: ComponentDisplayOptions
}

function RowAvatarBreadcrumbDialog({ options }: RowAvatarBreadcrumbDialogProps): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <ShowcaseFlexRow>
      <LeftCard $basis="36rem" $minHeight="26rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Typography</Text>}
        <SnippetButton title="Typography" snippets={typographySnippets} />
        <TypographyGroups>
          <TypographyGroup>
            <GroupLabel>Display</GroupLabel>
            <Text variant={TextVariant.display}>Display</Text>
          </TypographyGroup>
          <TypographyGroup>
            <GroupLabel>Headings</GroupLabel>
            <H1>Heading 1</H1>
            <H2>Heading 2</H2>
            <H3>Heading 3</H3>
          </TypographyGroup>
          <TypographyGroup>
            <GroupLabel>Body</GroupLabel>
            <Paragraph size="md">
              Body paragraph text sample rendered at the theme&apos;s current font stack.
            </Paragraph>
            <Paragraph size="sm">Small body paragraph for secondary reading contexts.</Paragraph>
          </TypographyGroup>
          <TypographyGroup>
            <GroupLabel>Labels &amp; captions</GroupLabel>
            <Text variant={TextVariant.label}>Label default</Text>
            <Text variant={TextVariant.labelSmall}>Label small</Text>
            <Text variant={TextVariant.caption}>Caption</Text>
            <Text variant={TextVariant.overline}>Overline</Text>
          </TypographyGroup>
        </TypographyGroups>
      </LeftCard>
      <RightCard $basis="18.125rem" $minHeight="26rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Dialog &amp; Drawer</Text>}
        <SnippetButton title="Dialog & Drawer" snippets={dialogDrawerSnippets} />
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
    </ShowcaseFlexRow>
  )
}

const MemoizedRowAvatarBreadcrumbDialog = memo(RowAvatarBreadcrumbDialog)
export { MemoizedRowAvatarBreadcrumbDialog as RowAvatarBreadcrumbDialog }
