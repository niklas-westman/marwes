<script lang="ts">
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
