<script lang="ts">
  import { createSwitchRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SwitchProps } from "./types.js";

  let {
    children,
    class: className,
    id,
    oncheckedchange,
    onclick,
    ariaDescribedBy,
    ariaLabel,
    ...coreProps
  }: SwitchProps = $props();

  const kit = $derived(createSwitchRecipe({
    ...coreProps,
    ...(ariaDescribedBy ? { ariaDescribedBy } : {}),
    ...(ariaLabel ? { ariaLabel } : {}),
  }));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(cssVarsToStyle(kit.vars));
  const isDisabled = $derived(kit.a11y.ariaDisabled === true);

  function handleClick(e: MouseEvent): void {
    onclick?.(e);
    if (isDisabled || e.defaultPrevented) return;
    oncheckedchange?.(!kit.a11y.ariaChecked);
  }
</script>

<button
  {id}
  type="button"
  role={kit.a11y.role}
  disabled={isDisabled}
  aria-checked={kit.a11y.ariaChecked}
  aria-disabled={kit.a11y.ariaDisabled}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-describedby={kit.a11y.ariaDescribedBy}
  class={mergedClass}
  style={mergedStyle}
  onclick={handleClick}
>
  <span class="mw-switch__track">
    <span class="mw-switch__thumb"></span>
  </span>
  {@render children?.()}
</button>
