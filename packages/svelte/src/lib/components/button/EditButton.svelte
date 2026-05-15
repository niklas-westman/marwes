<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "action">;
  let { dataAttributes, ...props }: Props = $props();
</script>
<Button {...props} variant="secondary" action="edit" iconRight={props.iconRight ?? "edit"} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("edit") }} />
