<script lang="ts">
  import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
    size?: "small" | "medium" | "large"
    dismissible?: boolean
    modal?: boolean
    showFooter?: boolean
  }

  let {
    title = "Dialog title",
    description,
    size = "medium",
    dismissible = true,
    modal = false,
    showFooter = true,
  }: Props = $props()
</script>

{#snippet footer({ close })}
  <CancelButton>Cancel</CancelButton>
  <ConfirmButton>Confirm</ConfirmButton>
{/snippet}

<Dialog
  {title}
  {description}
  {size}
  {dismissible}
  {modal}
  {showFooter}
  footer={showFooter ? footer : undefined}
>
  {#if showFooter}
    <Paragraph>
      Use the raw dialog surface when parent code owns the surrounding shell. <code>Dialog</code>
      does not claim modal behavior by default.
    </Paragraph>
  {:else}
    <Paragraph>
      This layout is useful when parent code owns the surrounding chrome, actions, and any modal boundary behavior.
    </Paragraph>
  {/if}
</Dialog>
