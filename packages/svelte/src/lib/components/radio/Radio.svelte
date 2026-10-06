<script lang="ts">
  import { radioRecipe, toRadioHtmlAttributes } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import { useRadioGroupContext } from "../../internal/radio-group-context.js";
  import type { RadioProps } from "./types.js";

  let {
    defaultChecked,
    checked = $bindable(defaultChecked ?? false),
    onchange,
    oncheckedchange,
    class: className,
    ...coreProps
  }: RadioProps = $props();

  const group = useRadioGroupContext();

  const kit = $derived(
    radioRecipe({ ...coreProps, ...(group?.disabled ? { disabled: true } : {}), checked })
  );
  const htmlAttributes = $derived(toRadioHtmlAttributes(kit.a11y));
  const mergedClass = $derived(mergeClass(kit.className, className));

  function handleChange(e: Event & { currentTarget: HTMLInputElement }): void {
    checked = e.currentTarget.checked;
    onchange?.(e);
    oncheckedchange?.(e.currentTarget.checked);
  }
</script>

<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
<input
  type="radio"
  class={mergedClass}
  {...htmlAttributes}
  {checked}
  onchange={handleChange}
/>
