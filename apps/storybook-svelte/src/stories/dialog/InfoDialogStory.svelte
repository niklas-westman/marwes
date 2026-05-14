<script lang="ts">
  import { InfoDialog, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
  }

  let {
    title = "Scheduled maintenance",
    description = "The workspace will be read-only for ten minutes.",
  }: Props = $props()

  let open = $state(true)
</script>

<InfoDialog bind:open {title} {description}>
  <Paragraph>Save your drafts before the maintenance window begins.</Paragraph>
</InfoDialog>
