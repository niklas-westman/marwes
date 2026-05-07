<script lang="ts">
  import InputField from "./InputField.svelte";
  import type { InputFieldProps } from "./types.js";
  type Props = Omit<InputFieldProps, "input"> & { input?: Omit<InputFieldProps["input"], "type" | "inputMode"> };
  let { input = {}, ...props }: Props = $props();
</script>
<div data-purpose="search">
  <InputField {...props} input={{ ...input, type: "search", inputMode: "search" }} />
</div>
