<script lang="ts">
  import InputField from "./InputField.svelte";
  import type { InputProps } from "./types.js";

  interface ZipCodeFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">;
    ariaDescribedBy?: string;
    value?: string;
    class?: string;
  }

  let { input, ...rest }: ZipCodeFieldProps = $props();
  const enhancedInput = $derived({ ...input, type: "text" as const, inputMode: "numeric" as const, autoComplete: "postal-code" });
</script>
<div data-purpose="zip-code">
  <InputField {...rest} input={enhancedInput} />
</div>
