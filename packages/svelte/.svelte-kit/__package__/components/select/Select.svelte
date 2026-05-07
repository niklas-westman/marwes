<script lang="ts">
  import { createSelectRecipe, resolveSelectMode } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SelectProps } from "./types.js";

  let {
    value = $bindable(""),
    onchange,
    class: className,
    style,
    describedBy,
    options,
    placeholder,
    ...rest
  }: SelectProps = $props();

  const kit = $derived(
    createSelectRecipe({
      ...rest,
      options,
      ...(placeholder ? { placeholder } : {}),
      value,
      ...(describedBy ? { describedBy } : {}),
    })
  );
  const mode = $derived(resolveSelectMode(rest));
  const mergedClass = $derived(mergeClass(kit.className, className));

  const placeholderSelected = $derived(!!placeholder && value === "");

  function handleChange(e: Event & { currentTarget: HTMLSelectElement }): void {
    value = e.currentTarget.value;
    onchange?.(e);
  }
</script>

{#if mode === "native"}
  <select
    class={mergedClass}
    {style}
    id={kit.a11y.id}
    name={kit.a11y.name}
    disabled={kit.a11y.disabled}
    required={kit.a11y.required}
    aria-label={kit.a11y.ariaLabel}
    aria-invalid={kit.a11y.ariaInvalid}
    aria-describedby={kit.a11y.ariaDescribedBy}
    data-placeholder-selected={placeholderSelected ? "true" : undefined}
    {value}
    onchange={handleChange}
  >
    {#if placeholder}
      <option value="" disabled={rest.required ? true : undefined}>{placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
    {/each}
  </select>
{:else}
  <span class="mw-select__control">
    <select
      class={mergedClass}
      {style}
      id={kit.a11y.id}
      name={kit.a11y.name}
      disabled={kit.a11y.disabled}
      required={kit.a11y.required}
      aria-label={kit.a11y.ariaLabel}
      aria-invalid={kit.a11y.ariaInvalid}
      aria-describedby={kit.a11y.ariaDescribedBy}
      data-placeholder-selected={placeholderSelected ? "true" : undefined}
      {value}
      onchange={handleChange}
    >
      {#if placeholder}
        <option value="" disabled={rest.required ? true : undefined}>{placeholder}</option>
      {/if}
      {#each options as opt}
        <option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
      {/each}
    </select>
    <svg class="mw-select__control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </span>
{/if}
