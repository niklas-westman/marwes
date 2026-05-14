<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import CancelButton from "../button/CancelButton.svelte";
  import ConfirmButton from "../button/ConfirmButton.svelte";
  import DialogModal from "./DialogModal.svelte";
  import type { ConfirmDialogProps } from "./types.js";

  let {
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onconfirm,
    oncancel,
    dataAttributes,
    ...dialogProps
  }: ConfirmDialogProps = $props();

  const mergedDataAttrs = $derived({
    ...dataAttributes,
    ...createPurposeSemanticAttributes("confirm-dialog"),
  });
</script>

<DialogModal {...dialogProps} dataAttributes={mergedDataAttrs}>
  {#snippet footer({ close })}
    <CancelButton onclick={() => { oncancel?.(); close(); }}>{cancelLabel}</CancelButton>
    <ConfirmButton onclick={() => { onconfirm?.(); close(); }}>{confirmLabel}</ConfirmButton>
  {/snippet}
</DialogModal>
