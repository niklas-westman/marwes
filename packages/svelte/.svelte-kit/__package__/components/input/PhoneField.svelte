<script lang="ts">
  import InputField from "./InputField.svelte";
  import type { InputFieldProps } from "./types.js";
  type Props = Omit<InputFieldProps, "input"> & { input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete"> };
  let { input = {}, ...props }: Props = $props();
</script>
<div data-purpose="phone">
  <InputField {...props} input={{ ...input, type: "tel", inputMode: "tel", autoComplete: "tel" }} />
</div>
