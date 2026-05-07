<script lang="ts">
  import { checkboxRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { CheckboxProps } from "./types.js";

  let {
    checked = $bindable(false),
    onchange,
    oncheckedchange,
    class: className,
    ariaDescribedBy,
    ...coreProps
  }: CheckboxProps = $props();

  const kit = $derived(checkboxRecipe({
    ...coreProps,
    checked,
    ...(ariaDescribedBy ? { ariaDescribedBy } : {}),
  }));
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
  id={kit.a11y.id}
  name={kit.a11y.name}
  value={kit.a11y.value}
  disabled={kit.a11y.disabled === true}
  required={kit.a11y.required === true}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-describedby={kit.a11y.ariaDescribedBy}
  aria-checked={kit.a11y.ariaChecked}
  aria-invalid={kit.a11y.ariaInvalid === true ? true : undefined}
  {checked}
  onchange={handleChange}
/>
