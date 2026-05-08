<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Avatar from "./Avatar.svelte";
  import type { AvatarProps } from "./types.js";
  let { dataAttributes, ...props }: AvatarProps = $props();
</script>
<Avatar {...props} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("profile") }} />
