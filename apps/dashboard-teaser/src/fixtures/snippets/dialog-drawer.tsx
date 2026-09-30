import { Button, ButtonVariant, DialogModal, Drawer, Paragraph } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Button variant={ButtonVariant.primary} onClick={() => setDialogOpen(true)}>
        Open dialog →
      </Button>
      <Button variant={ButtonVariant.secondary} onClick={() => setDrawerOpen(true)}>
        Open drawer →
      </Button>

      <DialogModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Dialog title"
        description="This is a dialog component."
        footer={
          <Button variant={ButtonVariant.primary} onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        }
      >
        <Paragraph>Dialog content goes here.</Paragraph>
      </DialogModal>

      {drawerOpen && (
        <Drawer
          modal
          title="Drawer"
          size="medium"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          footer={
            <Button variant={ButtonVariant.secondary} onClick={() => setDrawerOpen(false)}>
              Close drawer
            </Button>
          }
        >
          <p>Drawer content goes here.</p>
        </Drawer>
      )}
    </>
  )
}
