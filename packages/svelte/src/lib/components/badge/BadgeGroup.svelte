<script lang="ts">
  import { createBadgeGroupRecipe, toBadgeGroupHtmlAttributes } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import type { BadgeGroupProps } from "./types.js";

  let {
    label,
    children,
    class: className,
    id: userProvidedId,
  }: BadgeGroupProps = $props();

  const uniqueId = $props.id();
  const groupId = $derived(userProvidedId ?? `mw-badge-group-${uniqueId}`);
  const kit = $derived(createBadgeGroupRecipe({ id: groupId }));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<fieldset class={mergedClass} {...toBadgeGroupHtmlAttributes(kit.a11y)}>
  <legend class="mw-badge-group__label" id={kit.labelId}>
    <Text variant="caption">{label}</Text>
  </legend>
  <div class="mw-badge-group__items">
    {@render children?.()}
  </div>
</fieldset>
