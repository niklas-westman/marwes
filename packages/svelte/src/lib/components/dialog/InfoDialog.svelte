<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import ConfirmButton from "../button/ConfirmButton.svelte";
  import DialogModal from "./DialogModal.svelte";
  import type { InfoDialogProps } from "./types.js";

  let {
    acknowledgeLabel = "Okay",
    onacknowledge,
    dataAttributes,
    ...dialogProps
  }: InfoDialogProps = $props();

  const mergedDataAttrs = $derived({
    ...dataAttributes,
    ...createPurposeSemanticAttributes("info-dialog"),
  });
</script>

<DialogModal {...dialogProps} dataAttributes={mergedDataAttrs}>
  {#snippet footer({ close })}
    <ConfirmButton onclick={() => { onacknowledge?.(); close(); }}>{acknowledgeLabel}</ConfirmButton>
  {/snippet}
</DialogModal>
