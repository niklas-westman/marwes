<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import CancelButton from "../button/CancelButton.svelte";
  import DestructiveButton from "../button/DestructiveButton.svelte";
  import DialogModal from "./DialogModal.svelte";
  import type { DestructiveDialogProps } from "./types.js";

  let {
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onconfirm,
    oncancel,
    dataAttributes,
    ...dialogProps
  }: DestructiveDialogProps = $props();

  const mergedDataAttrs = $derived({
    ...dataAttributes,
    ...createPurposeSemanticAttributes("destructive-dialog"),
  });
</script>

<DialogModal {...dialogProps} dataAttributes={mergedDataAttrs}>
  {#snippet footer({ close })}
    <CancelButton onclick={() => { oncancel?.(); close(); }}>{cancelLabel}</CancelButton>
    <DestructiveButton onclick={() => { onconfirm?.(); close(); }}>{confirmLabel}</DestructiveButton>
  {/snippet}
</DialogModal>
