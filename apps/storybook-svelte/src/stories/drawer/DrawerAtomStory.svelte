<script lang="ts">
  import { CancelButton, ConfirmButton, Drawer, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
    size?: "small" | "medium" | "large"
    placement?: "left" | "right"
    dismissible?: boolean
    modal?: boolean
    showFooter?: boolean
    showScrim?: boolean
  }

  let {
    title = "Drawer title",
    description,
    size = "medium",
    placement = "right",
    dismissible = true,
    modal = true,
    showFooter = true,
    showScrim = true,
  }: Props = $props()
</script>

{#snippet footer({ close })}
  <CancelButton>Cancel</CancelButton>
  <ConfirmButton>Apply</ConfirmButton>
{/snippet}

<Drawer
  {title}
  {description}
  {size}
  {placement}
  {dismissible}
  {modal}
  {showFooter}
  {showScrim}
  footer={showFooter ? footer : undefined}
  onclose={() => undefined}
>
  <Paragraph>
    Keep workflow-specific state in the parent and use Drawer for the side panel shell.
  </Paragraph>
</Drawer>
