<script lang="ts">
  import { type ButtonVariant, createButtonRecipe } from "@marwes-ui/core";
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
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));

  const resolvedVariant = $derived((options.variant ?? "primary") as ButtonVariant);
  const isFilledVariant = $derived(resolvedVariant === "primary" || resolvedVariant === "success");

  const visibleLabel = $derived(
    kit.loading.isLoading && kit.loading.loadingLabel !== undefined
      ? kit.loading.loadingLabel
      : undefined
  );

  function handleClick(e: MouseEvent): void {
    if (kit.blockClick) {
      e.preventDefault();
      return;
    }
    onclick?.(e);
  }
</script>

{#if kit.tag === "button"}
  <button
    type={kit.a11y.type}
    disabled={kit.a11y.disabled}
    aria-label={kit.a11y.ariaLabel}
    aria-busy={kit.a11y.ariaBusy}
    aria-disabled={kit.a11y.ariaDisabled}
    aria-pressed={kit.a11y.ariaPressed}
    aria-expanded={kit.a11y.ariaExpanded}
    aria-controls={kit.a11y.ariaControls}
    title={kit.a11y.title}
    class={mergedClass}
    style={mergedStyle}
    onclick={handleClick}
    {...kit.dataAttributes}
  >
    {#if kit.loading.isLoading}
      <ButtonSpinner variant={kit.loading.spinnerVariant} inverted={isFilledVariant} />
    {:else if options.iconLeft}
      <Icon name={options.iconLeft} size="xs" strokeWidth="sm" decorative />
    {/if}
    {#if visibleLabel}
      {visibleLabel}
    {:else}
      {@render children?.()}
    {/if}
    {#if !kit.loading.isLoading && options.iconRight}
      <Icon name={options.iconRight} size="xs" strokeWidth="sm" decorative />
    {/if}
  </button>
{:else}
  <a
    href={kit.a11y.href}
    role={kit.a11y.role}
    tabindex={kit.a11y.tabIndex}
    aria-label={kit.a11y.ariaLabel}
    aria-busy={kit.a11y.ariaBusy}
    aria-disabled={kit.a11y.ariaDisabled}
    aria-pressed={kit.a11y.ariaPressed}
    aria-expanded={kit.a11y.ariaExpanded}
    aria-controls={kit.a11y.ariaControls}
    title={kit.a11y.title}
    class={mergedClass}
    style={mergedStyle}
    onclick={handleClick}
    {...kit.dataAttributes}
  >
    {#if kit.loading.isLoading}
      <ButtonSpinner variant={kit.loading.spinnerVariant} inverted={isFilledVariant} />
    {:else if options.iconLeft}
      <Icon name={options.iconLeft} size="xs" strokeWidth="sm" decorative />
    {/if}
    {#if visibleLabel}
      {visibleLabel}
    {:else}
      {@render children?.()}
    {/if}
    {#if !kit.loading.isLoading && options.iconRight}
      <Icon name={options.iconRight} size="xs" strokeWidth="sm" decorative />
    {/if}
  </a>
{/if}
