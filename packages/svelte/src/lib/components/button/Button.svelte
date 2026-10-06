<script lang="ts">
  import { createButtonRecipe, toButtonHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import ButtonSpinner from "../spinner/ButtonSpinner.svelte";
  import type { ButtonProps } from "./types.js";

  let {
    children,
    onclick,
    class: className,
    style,
    ...options
  }: ButtonProps = $props();

  const kit = $derived(createButtonRecipe(options));
  const htmlAttributes = $derived(toButtonHtmlAttributes(kit.a11y));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));

  const loadingLabelOverride = $derived(
    kit.loading.isLoading ? kit.loading.loadingLabel : undefined
  );

  function handleClick(e: MouseEvent): void {
    if (kit.blockClick) {
      e.preventDefault();
      return;
    }
    onclick?.(e);
  }
</script>

{#snippet buttonContent()}
  {#if kit.loading.isLoading}
    <ButtonSpinner variant={kit.loading.spinnerVariant} inverted={kit.loading.spinnerInverted} />
  {:else if options.iconLeft}
    <Icon name={options.iconLeft} size="xs" strokeWidth="sm" decorative />
  {/if}
  {#if loadingLabelOverride !== undefined}
    {#if loadingLabelOverride}
      <span class="mw-btn__label">{loadingLabelOverride}</span>
    {/if}
  {:else if children}
    <span class="mw-btn__label">
      {@render children()}
    </span>
  {/if}
  {#if !kit.loading.isLoading && options.iconRight}
    <Icon name={options.iconRight} size="xs" strokeWidth="sm" decorative />
  {/if}
{/snippet}

{#if kit.tag === "button"}
  <button
    {...htmlAttributes}
    class={mergedClass}
    style={mergedStyle}
    onclick={handleClick}
    {...kit.dataAttributes}
  >
    {@render buttonContent()}
  </button>
{:else}
  <a
    {...htmlAttributes}
    class={mergedClass}
    style={mergedStyle}
    onclick={handleClick}
    {...kit.dataAttributes}
  >
    {@render buttonContent()}
  </a>
{/if}
