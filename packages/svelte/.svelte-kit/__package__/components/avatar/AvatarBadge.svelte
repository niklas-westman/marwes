<script lang="ts">
  import { createAvatarRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Avatar from "./Avatar.svelte";
  import type { AvatarProps } from "./types.js";

  interface AvatarBadgeProps extends AvatarProps {
    statusLabel?: string;
  }

  let {
    class: className,
    statusLabel = "Online",
    decorative,
    ...avatarProps
  }: AvatarBadgeProps = $props();

  const kit = $derived(createAvatarRecipe(avatarProps));
  const resolvedSize = $derived(kit.dataAttributes["data-size"]);

  const accessibleLabel = $derived.by(() => {
    if (kit.a11y.ariaHidden) return undefined;
    if (kit.content.type === "image") {
      return kit.content.alt ? `${kit.content.alt}, ${statusLabel}` : statusLabel;
    }
    return kit.a11y.ariaLabel ? `${kit.a11y.ariaLabel}, ${statusLabel}` : statusLabel;
  });

  const mergedClass = $derived(
    mergeClass("mw-avatar-badge", `mw-avatar-badge--${resolvedSize}`, className)
  );
</script>

<span
  class={mergedClass}
  data-component="avatar-badge"
  data-size={resolvedSize}
  data-status="online"
  role={decorative ? undefined : "img"}
  aria-hidden={decorative ? "true" : undefined}
  aria-label={decorative ? undefined : accessibleLabel}
>
  <Avatar {...avatarProps} decorative />
  <span aria-hidden="true" class="mw-avatar-badge__indicator"></span>
</span>
