import {
  Button,
  ButtonVariant,
  ConfirmDialog,
  DestructiveDialog,
  DialogModal,
  Paragraph,
} from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function DialogShowcase(): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [destructiveOpen, setDestructiveOpen] = useState(false)

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Base modal</h3>
        <p>A portaled dialog with custom footer content for cases no purpose wrapper fits.</p>
        <ShowcaseStack>
          <Button variant={ButtonVariant.primary} onClick={() => setModalOpen(true)}>
            Open dialog
          </Button>
          <DialogModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Project settings"
            description="Changes apply to every member of this workspace."
            footer={
              <Button variant={ButtonVariant.primary} onClick={() => setModalOpen(false)}>
                Close
              </Button>
            }
          >
            <Paragraph>Dialog content goes here.</Paragraph>
          </DialogModal>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Confirm action</h3>
        <p>A reversible action gets an explicit cancel and confirm control.</p>
        <ShowcaseStack>
          <Button variant={ButtonVariant.secondary} onClick={() => setConfirmOpen(true)}>
            Leave workspace
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Leave this workspace?"
            description="You can rejoin later if you're invited again."
            confirmLabel="Leave"
            onConfirm={() => setConfirmOpen(false)}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Destructive action</h3>
        <p>An irreversible action carries explicit warning intent in its controls.</p>
        <ShowcaseStack>
          <Button variant={ButtonVariant.danger} onClick={() => setDestructiveOpen(true)}>
            Delete project
          </Button>
          <DestructiveDialog
            open={destructiveOpen}
            onOpenChange={setDestructiveOpen}
            title="Delete this project?"
            description="This permanently removes the project and its history."
            confirmLabel="Delete"
            onConfirm={() => setDestructiveOpen(false)}
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default DialogShowcase
