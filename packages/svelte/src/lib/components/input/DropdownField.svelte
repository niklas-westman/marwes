<script lang="ts">
  import SelectField from "./SelectField.svelte";
  import type { SelectProps } from "./types.js";

  interface DropdownFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    select?: SelectProps;
    ariaDescribedBy?: string;
    value?: string;
    class?: string;
  }

  let {
    select = { options: [] },
    value = $bindable(""),
    ...fieldProps
  }: DropdownFieldProps = $props();

  const dropdownSelect = $derived({
    ...select,
    native: select.native ?? false,
  });
</script>
<div data-purpose="dropdown">
  <SelectField {...fieldProps} select={dropdownSelect} bind:value />
</div>
