<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "action">;
  let { dataAttributes, ...props }: Props = $props();
</script>
<Button {...props} action="cancel" variant={props.variant ?? "neutral"} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("cancel"), "data-cancel": "true" }} />
