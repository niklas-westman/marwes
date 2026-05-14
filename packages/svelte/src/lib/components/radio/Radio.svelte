<script lang="ts">
  import { radioRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { RadioProps } from "./types.js";

  let {
    checked = $bindable(false),
    onchange,
    oncheckedchange,
    class: className,
    ...coreProps
  }: RadioProps = $props();

  const kit = $derived(radioRecipe({ ...coreProps, checked }));
  const mergedClass = $derived(mergeClass(kit.className, className));

  function handleChange(e: Event & { currentTarget: HTMLInputElement }): void {
    checked = e.currentTarget.checked;
    onchange?.(e);
    oncheckedchange?.(e.currentTarget.checked);
  }
</script>

<input
  type="radio"
  class={mergedClass}
  id={kit.a11y.id}
  name={kit.a11y.name}
  value={kit.a11y.value}
  disabled={kit.a11y.disabled === true}
  required={kit.a11y.required === true}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-describedby={kit.a11y.ariaDescribedBy}
  aria-invalid={kit.a11y.ariaInvalid === true ? true : undefined}
  {checked}
  onchange={handleChange}
/>
