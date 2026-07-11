<script lang="ts">
  import { CancelButton, ConfirmButton, DialogModal, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
    size?: "small" | "medium" | "large"
    dismissible?: boolean
    closeOnEscape?: boolean
    closeOnScrimClick?: boolean
    surfaceWidth?: string | number
    tone?: "default" | "calm"
    divider?: "visible" | "hidden"
  }

  let {
    title = "Invite teammates",
    description = "Select a role and invite collaborators to the workspace.",
    size,
    dismissible,
    closeOnEscape,
    closeOnScrimClick,
    surfaceWidth,
    tone,
    divider,
  }: Props = $props()

  let open = $state(true)
</script>

<DialogModal
  bind:open
  {title}
  {description}
  {...(size ? { size } : {})}
  {...(dismissible !== undefined ? { dismissible } : {})}
  {...(closeOnEscape !== undefined ? { closeOnEscape } : {})}
  {...(closeOnScrimClick !== undefined ? { closeOnScrimClick } : {})}
  {...(surfaceWidth !== undefined ? { surfaceWidth } : {})}
  {...(tone !== undefined ? { tone } : {})}
  {...(divider !== undefined ? { divider } : {})}
>
  {#if dismissible === false}
    {#snippet footer()}
      <ConfirmButton>Continue</ConfirmButton>
    {/snippet}
    <Paragraph>
      The migration runs in the background and will notify you when it is safe to continue.
    </Paragraph>
  {:else}
    {#snippet footer({ close })}
      <CancelButton onclick={close}>Cancel</CancelButton>
      <ConfirmButton onclick={close}>Continue</ConfirmButton>
    {/snippet}
    <Paragraph>
      DialogModal owns the scrim, modal semantics, close affordances, and focus restoration.
    </Paragraph>
  {/if}
</DialogModal>
