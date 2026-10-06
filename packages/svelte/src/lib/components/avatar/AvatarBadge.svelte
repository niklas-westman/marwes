<script lang="ts">
  import { createAvatarBadgeRecipe, toAvatarBadgeHtmlAttributes } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Avatar from "./Avatar.svelte";
  import type { AvatarProps } from "./types.js";

  interface AvatarBadgeProps extends AvatarProps {
    statusLabel?: string;
  }

  let {
    class: className,
    statusLabel,
    decorative,
    dataAttributes,
    ...avatarProps
  }: AvatarBadgeProps = $props();

  const badgeKit = $derived(
    createAvatarBadgeRecipe({ ...avatarProps, decorative, ...(statusLabel !== undefined ? { statusLabel } : {}) })
  );
  const mergedClass = $derived(mergeClass(badgeKit.className, className));
</script>

<span
  class={mergedClass}
  {...badgeKit.dataAttributes}
  {...toAvatarBadgeHtmlAttributes(badgeKit.a11y)}
  {...dataAttributes}
>
  <Avatar {...avatarProps} decorative />
  <span aria-hidden="true" class="mw-avatar-badge__indicator"></span>
</span>
