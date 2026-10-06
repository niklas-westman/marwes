<script lang="ts">
  import { checkboxRecipe, toCheckboxHtmlAttributes } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { CheckboxProps } from "./types.js";

  let {
    checked = $bindable(),
    onchange,
    oncheckedchange,
    class: className,
    ariaDescribedBy,
    ...coreProps
  }: CheckboxProps = $props();

  const kit = $derived(checkboxRecipe({
    ...coreProps,
    ...(checked !== undefined ? { checked } : {}),
    ...(ariaDescribedBy ? { ariaDescribedBy } : {}),
  }));
  const htmlAttributes = $derived(toCheckboxHtmlAttributes(kit.a11y));
  const mergedClass = $derived(mergeClass(kit.className, className));

  let inputElement: HTMLInputElement | undefined = $state(undefined);

  $effect(() => {
    if (inputElement) {
      inputElement.indeterminate = kit.indeterminate;
    }
  });

  function handleChange(e: Event & { currentTarget: HTMLInputElement }): void {
    checked = e.currentTarget.checked;
    onchange?.(e);
    oncheckedchange?.(e.currentTarget.checked);
  }
</script>

<input
  bind:this={inputElement}
  type="checkbox"
  class={mergedClass}
  {...htmlAttributes}
  checked={kit.checked}
  defaultChecked={kit.defaultChecked}
  onchange={handleChange}
/>
