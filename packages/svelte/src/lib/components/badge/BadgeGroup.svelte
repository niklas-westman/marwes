<script lang="ts">
  import { mergeClass } from "../../internal/merge-class.js";
  import type { BadgeGroupProps } from "./types.js";

  let {
    label,
    children,
    class: className,
    id: userProvidedId,
  }: BadgeGroupProps = $props();

  const uniqueId = $props.id();
  const groupId = $derived(userProvidedId ?? `mw-badge-group-${uniqueId}`);
  const labelId = $derived(`${groupId}-label`);
  const mergedClass = $derived(mergeClass("mw-badge-group", className));
</script>

<fieldset class={mergedClass} aria-labelledby={labelId}>
  <legend class="mw-badge-group__label" id={labelId}>
    <p class="mw-p mw-p--sm">{label}</p>
  </legend>
  <div class="mw-badge-group__items">
    {@render children?.()}
  </div>
</fieldset>
