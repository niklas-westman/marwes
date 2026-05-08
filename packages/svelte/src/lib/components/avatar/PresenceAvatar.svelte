<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import AvatarBadge from "./AvatarBadge.svelte";
  import type { AvatarProps } from "./types.js";

  interface PresenceAvatarProps extends AvatarProps {
    statusLabel?: string;
  }

  let { dataAttributes, ...props }: PresenceAvatarProps = $props();
</script>
<AvatarBadge {...props} dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("presence") }} />
