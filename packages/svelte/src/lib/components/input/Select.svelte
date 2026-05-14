<script lang="ts">
  import { createSelectRecipe, resolveSelectMode } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SelectProps } from "./types.js";

  let {
    value = $bindable(""),
    onchange,
    onvaluechange,
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
    onvaluechange?.(value);
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
    <svg class="mw-select__control-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M11.5288 5.52876C11.7891 5.26841 12.2111 5.26841 12.4715 5.52876C12.7318 5.78911 12.7318 6.21114 12.4715 6.47147L8.47148 10.4715C8.21115 10.7318 7.78912 10.7318 7.52877 10.4715L3.52876 6.47147C3.26841 6.21112 3.26841 5.78911 3.52876 5.52876C3.78911 5.26841 4.21112 5.26841 4.47147 5.52876L6.58591 7.6432C7.36696 8.42425 8.63329 8.42425 9.41434 7.6432L11.5288 5.52876Z" fill="currentColor" />
    </svg>
  </span>
{/if}
