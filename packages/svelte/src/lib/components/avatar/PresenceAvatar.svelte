<script lang="ts">
  import AvatarBadge from "./AvatarBadge.svelte";
  import type { AvatarProps } from "./types.js";

  interface PresenceAvatarProps extends AvatarProps {
    statusLabel?: string;
  }

  let props: PresenceAvatarProps = $props();
</script>
<div data-purpose="presence">
  <AvatarBadge {...props} />
</div>
