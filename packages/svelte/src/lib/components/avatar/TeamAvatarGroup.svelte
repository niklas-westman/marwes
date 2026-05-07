<script lang="ts">
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
    class?: string;
  }

  let props: TeamAvatarGroupProps = $props();
</script>
<div data-purpose="team">
  <AvatarGroup {...props} />
</div>
