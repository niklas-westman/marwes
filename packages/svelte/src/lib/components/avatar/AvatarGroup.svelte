<script lang="ts">
  import {
    createAvatarGroupRecipe,
    toAvatarGroupCounterHtmlAttributes,
    toAvatarGroupHtmlAttributes,
  } from "@marwes-ui/core";
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

  const kit = $derived(
    createAvatarGroupRecipe({
      ...(overflowCount !== undefined ? { overflowCount } : {}),
      ...(overflowLabel !== undefined ? { overflowLabel } : {}),
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      ...(label !== undefined ? { label } : {}),
    })
  );
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<fieldset
  class={mergedClass}
  {...kit.dataAttributes}
  {...toAvatarGroupHtmlAttributes(kit.a11y)}
  {...dataAttributes}
>
  {#each items as item, i}
    <span class="mw-avatar-group__item">
      <Avatar {...item} size="medium" />
    </span>
  {/each}

  {#if kit.counter.visible}
    <span class="mw-avatar-group__counter" {...toAvatarGroupCounterHtmlAttributes(kit.counter.a11y)}>
      {kit.counter.text}
    </span>
  {/if}
</fieldset>
