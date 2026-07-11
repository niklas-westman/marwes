<script lang="ts">
  import DialogModal from "../../lib/components/dialog/DialogModal.svelte";

  let {
    title,
    description,
    ariaLabel,
    dismissible,
    showFooter = true,
    closeOnEscape,
    closeOnScrimClick,
    surfaceWidth,
    tone,
    divider,
    includeInput = false,
    onopenchange,
  }: {
    title?: string;
    description?: string;
    ariaLabel?: string;
    dismissible?: boolean;
    showFooter?: boolean;
    closeOnEscape?: boolean;
    closeOnScrimClick?: boolean;
    surfaceWidth?: string | number;
    tone?: "default" | "calm";
    divider?: "visible" | "hidden";
    includeInput?: boolean;
    onopenchange?: (open: boolean) => void;
  } = $props();
</script>

<button type="button">Outside</button>

{#if showFooter}
  <DialogModal
    open
    {title}
    {description}
    {ariaLabel}
    {dismissible}
    {closeOnEscape}
    {closeOnScrimClick}
    {surfaceWidth}
    {tone}
    {divider}
    {onopenchange}
  >
    {#if includeInput}
      <input aria-label="Workspace name" value="Acme" />
    {:else}
      <p>Dialog content</p>
    {/if}

    {#snippet footer()}
      <button type="button">Cancel</button>
      <button type="button">Confirm</button>
    {/snippet}
  </DialogModal>
{:else}
  <DialogModal
    open
    {title}
    {description}
    {ariaLabel}
    {dismissible}
    {closeOnEscape}
    {closeOnScrimClick}
    {surfaceWidth}
    {tone}
    {divider}
    {onopenchange}
  >
    {#if includeInput}
      <input aria-label="Workspace name" value="Acme" />
    {:else}
      <p>Dialog content</p>
    {/if}
  </DialogModal>
{/if}

<button type="button">After dialog</button>
