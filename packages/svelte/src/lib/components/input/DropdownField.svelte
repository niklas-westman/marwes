<script lang="ts">
  import SelectField from "./SelectField.svelte";
  import type { SelectProps } from "./types.js";

  interface DropdownFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    select?: Omit<SelectProps, "value">;
    ariaDescribedBy?: string;
    value?: string;
    class?: string;
  }

  let props: DropdownFieldProps = $props();
</script>
<div data-purpose="dropdown">
  <SelectField {...props} />
</div>
