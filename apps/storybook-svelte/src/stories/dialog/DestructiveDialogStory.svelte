<script lang="ts">
  import { DestructiveDialog, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
  }

  let {
    title = "Delete workspace",
    description = "This action permanently removes all projects, members, and history.",
  }: Props = $props()

  let open = $state(false)
</script>

<button type="button" class="mw-btn mw-btn--primary mw-btn--md" onclick={() => (open = true)}>
  Open destructive dialog
</button>

<DestructiveDialog bind:open {title} {description}>
  <Paragraph>Make sure you exported anything you need before continuing.</Paragraph>
</DestructiveDialog>
