<script lang="ts">
  import { CancelButton, ConfirmButton, DialogModal, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    title?: string
    description?: string
    size?: "small" | "medium" | "large"
    dismissible?: boolean
    closeOnEscape?: boolean
    closeOnScrimClick?: boolean
  }

  let {
    title = "Invite teammates",
    description = "Select a role and invite collaborators to the workspace.",
    size,
    dismissible,
    closeOnEscape,
    closeOnScrimClick,
  }: Props = $props()

  let open = $state(false)
</script>

<button type="button" class="mw-btn mw-btn--primary mw-btn--md" onclick={() => (open = true)}>
  Open dialog
</button>

<DialogModal
  bind:open
  {title}
  {description}
  {...(size ? { size } : {})}
  {...(dismissible !== undefined ? { dismissible } : {})}
  {...(closeOnEscape !== undefined ? { closeOnEscape } : {})}
  {...(closeOnScrimClick !== undefined ? { closeOnScrimClick } : {})}
>
  {#snippet footer({ close })}
    <CancelButton onclick={close}>Cancel</CancelButton>
    <ConfirmButton onclick={close}>Continue</ConfirmButton>
  {/snippet}
  <Paragraph>
    DialogModal owns the scrim, modal semantics, close affordances, and focus restoration.
  </Paragraph>
</DialogModal>
