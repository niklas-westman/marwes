<script lang="ts">
  import DialogModal from "../../lib/components/dialog/DialogModal.svelte";

  let {
    title,
    description,
    restoreFocus,
    closeOnScrimClick,
  }: {
    title?: string;
    description?: string;
    restoreFocus?: boolean;
    closeOnScrimClick?: boolean;
  } = $props();

  let open = $state(false);
</script>

<button type="button" onclick={() => { open = true; }}>Open dialog</button>

<DialogModal
  bind:open
  {title}
  {description}
  {restoreFocus}
  {closeOnScrimClick}
  onopenchange={(nextOpen) => { open = nextOpen; }}
>
  <p>Dialog content</p>

  {#snippet footer()}
    <button type="button">Done</button>
  {/snippet}
</DialogModal>
