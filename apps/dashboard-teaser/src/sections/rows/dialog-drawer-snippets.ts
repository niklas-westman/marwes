import type { Framework } from "../installation-recipes"

const react = `import { Button, ButtonVariant, DialogModal, Drawer, Paragraph } from "@marwes-ui/react"
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
`

const vue = `<script setup lang="ts">
import { ref } from "vue"
import { Button, DialogModal, Drawer, Paragraph } from "@marwes-ui/vue"

const dialogOpen = ref(false)
const drawerOpen = ref(false)
</script>

<template>
  <Button variant="primary" @click="dialogOpen = true">Open dialog →</Button>
  <Button variant="secondary" @click="drawerOpen = true">Open drawer →</Button>

  <DialogModal
    v-model:open="dialogOpen"
    title="Dialog title"
    description="This is a dialog component."
  >
    <Paragraph>Dialog content goes here.</Paragraph>
    <template #footer>
      <Button variant="primary" @click="dialogOpen = false">Close</Button>
    </template>
  </DialogModal>

  <Drawer
    v-if="drawerOpen"
    modal
    title="Drawer"
    size="medium"
    placement="right"
    @close="drawerOpen = false"
  >
    <p>Drawer content goes here.</p>
    <template #footer>
      <Button variant="secondary" @click="drawerOpen = false">Close drawer</Button>
    </template>
  </Drawer>
</template>
`

const svelte = `<script lang="ts">
  import { Button, DialogModal, Drawer, Paragraph } from "@marwes-ui/svelte"

  let dialogOpen = $state(false)
  let drawerOpen = $state(false)
</script>

<Button variant="primary" onclick={() => (dialogOpen = true)}>Open dialog →</Button>
<Button variant="secondary" onclick={() => (drawerOpen = true)}>Open drawer →</Button>

<DialogModal
  bind:open={dialogOpen}
  title="Dialog title"
  description="This is a dialog component."
>
  <Paragraph>Dialog content goes here.</Paragraph>
  {#snippet footer()}
    <Button variant="primary" onclick={() => (dialogOpen = false)}>Close</Button>
  {/snippet}
</DialogModal>

{#if drawerOpen}
  <Drawer
    modal
    title="Drawer"
    size="medium"
    placement="right"
    onclose={() => (drawerOpen = false)}
  >
    <p>Drawer content goes here.</p>
    {#snippet footer()}
      <Button variant="secondary" onclick={() => (drawerOpen = false)}>Close drawer</Button>
    {/snippet}
  </Drawer>
{/if}
`

const dialogDrawerSnippets: Record<Framework, string> = { react, vue, svelte }

export { dialogDrawerSnippets }
