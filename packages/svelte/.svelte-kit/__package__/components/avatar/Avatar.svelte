<script lang="ts">
  import { createAvatarRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { AvatarProps } from "./types.js";

  let {
    class: className,
    style,
    dataAttributes,
    ...options
  }: AvatarProps = $props();

  const kit = $derived(createAvatarRecipe(options));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const isDecorative = $derived(kit.a11y.ariaHidden === true);
  const isOuterAccessible = $derived(kit.a11y.role === "img");
</script>

<span
  class={mergedClass}
  {style}
  role={kit.a11y.role}
  aria-hidden={isDecorative ? "true" : undefined}
  aria-label={kit.a11y.ariaLabel}
  {...kit.dataAttributes}
  {...dataAttributes}
>
  {#if kit.content.type === "image"}
    <img
      class="mw-avatar__image"
      src={kit.content.src}
      alt={isDecorative ? "" : (kit.content.alt ?? "")}
    />
  {:else if kit.content.type === "initials"}
    <span
      aria-hidden={isOuterAccessible ? "true" : undefined}
      class="mw-avatar__initials"
    >
      {kit.content.initials}
    </span>
  {:else}
    <Icon name={kit.content.iconName ?? "user"} class="mw-avatar__icon" decorative />
  {/if}
</span>
