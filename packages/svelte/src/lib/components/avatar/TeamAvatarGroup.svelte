<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import AvatarGroup from "./AvatarGroup.svelte";
  import type { AvatarProps } from "./types.js";

  interface AvatarGroupItem extends Omit<AvatarProps, "size" | "class" | "style"> {
    id?: string;
  }

  interface TeamAvatarGroupProps {
    items: AvatarGroupItem[];
    overflowCount?: number;
    overflowLabel?: string;
    ariaLabel?: string;
    dataAttributes?: Record<string, string>;
    class?: string;
  }

  let { dataAttributes, ...props }: TeamAvatarGroupProps = $props();
</script>
<AvatarGroup {...props} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("team") }} />
