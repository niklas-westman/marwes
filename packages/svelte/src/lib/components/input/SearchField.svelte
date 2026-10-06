<script lang="ts">
  import InputField from "./InputField.svelte";
  import type { InputFieldProps } from "./types.js";
  type Props = Omit<InputFieldProps, "input"> & { input?: Omit<InputFieldProps["input"], "type" | "inputMode"> };
  let { input = {}, value = $bindable(), ...props }: Props = $props();
</script>
<div data-purpose="search">
  <InputField {...props} bind:value input={{ ...input, type: "search", inputMode: "search" }} />
</div>
