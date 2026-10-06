<script lang="ts">
  import { createSwitchRecipe, toSwitchHtmlAttributes } from "@marwes-ui/core";
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
  const htmlAttributes = $derived(toSwitchHtmlAttributes(kit.a11y));
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
  {...htmlAttributes}
  disabled={isDisabled}
  class={mergedClass}
  style={mergedStyle}
  onclick={handleClick}
>
  <span class="mw-switch__track">
    <span class="mw-switch__thumb"></span>
  </span>
  {@render children?.()}
</button>
