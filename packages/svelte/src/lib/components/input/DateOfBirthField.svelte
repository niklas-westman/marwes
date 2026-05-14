<script lang="ts">
  import InputField from "./InputField.svelte";
  import type { InputProps } from "./types.js";

  interface DateOfBirthFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    input?: Omit<InputProps, "type" | "autoComplete">;
    ariaDescribedBy?: string;
    value?: string;
    class?: string;
  }

  let { input, ...rest }: DateOfBirthFieldProps = $props();
  const enhancedInput = $derived({ ...input, type: "date" as const, autoComplete: "bday" });
</script>
<div data-purpose="date-of-birth">
  <InputField {...rest} input={enhancedInput} />
</div>
