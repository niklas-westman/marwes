<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Button from "./Button.svelte";
  import type { ButtonProps } from "./types.js";
  type Props = Omit<ButtonProps, "variant" | "action">;
  let { dataAttributes, ...props }: Props = $props();
</script>
<Button {...props} variant="secondary" action="button" iconRight={props.iconRight ?? "upload"} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("upload"), "data-transfer": "upload" }} />
