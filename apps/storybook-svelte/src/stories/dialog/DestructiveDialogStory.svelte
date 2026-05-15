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

  let open = $state(true)
</script>

<DestructiveDialog bind:open {title} {description}>
  <Paragraph>Make sure you exported anything you need before continuing.</Paragraph>
</DestructiveDialog>
