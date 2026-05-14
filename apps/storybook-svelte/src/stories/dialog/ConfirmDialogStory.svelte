<script lang="ts">
  import { ConfirmDialog, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
  }

  let {
    title = "Publish update",
    description = "This sends the release to subscribers immediately.",
  }: Props = $props()

  let open = $state(true)
</script>

<ConfirmDialog bind:open {title} {description}>
  <Paragraph>Review the release summary before confirming.</Paragraph>
</ConfirmDialog>
