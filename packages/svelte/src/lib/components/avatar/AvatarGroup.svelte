<script lang="ts">
  import { mergeClass } from "../../internal/merge-class.js";
  import Avatar from "./Avatar.svelte";
  import type { AvatarProps } from "./types.js";

  interface AvatarGroupItem extends Omit<AvatarProps, "size" | "class" | "style"> {
    id?: string;
  }

  interface AvatarGroupProps {
    items: AvatarGroupItem[];
    overflowCount?: number;
    overflowLabel?: string;
    ariaLabel?: string;
    label?: string;
    dataAttributes?: Record<string, string>;
    class?: string;
  }

  let {
    items,
    overflowCount,
    overflowLabel,
    ariaLabel,
    label,
    dataAttributes,
    class: className,
  }: AvatarGroupProps = $props();

  const mergedClass = $derived(mergeClass("mw-avatar-group", className));
  const groupLabel = $derived(ariaLabel ?? label ?? "Avatar group");
  const shouldRenderOverflow = $derived(overflowCount !== undefined && overflowCount > 0);
  const resolvedOverflowLabel = $derived(overflowLabel ?? `${overflowCount} more people`);
</script>

<fieldset
  class={mergedClass}
  data-component="avatar-group"
  aria-label={groupLabel}
  {...dataAttributes}
>
  {#each items as item, i}
    <span class="mw-avatar-group__item">
      <Avatar {...item} size="medium" />
    </span>
  {/each}

  {#if shouldRenderOverflow}
    <span aria-label={resolvedOverflowLabel} class="mw-avatar-group__counter" role="img">
      +{overflowCount}
    </span>
  {/if}
</fieldset>
