<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Badge from "./Badge.svelte";
  import type { BadgeProps } from "./types.js";
  let { dataAttributes, ...props }: BadgeProps = $props();
</script>
<Badge {...props} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("priority") }} />
