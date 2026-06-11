<script lang="ts">
  import InputField from "./InputField.svelte";
  import type { InputFieldProps } from "./types.js";
  type Props = InputFieldProps & { currency?: string };
  let { currency, input = {}, ...props }: Props = $props();

  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", SEK: "kr", NOK: "kr", DKK: "kr", CHF: "CHF", BTC: "₿" };
  const leadingSymbol = $derived(currency ? symbols[currency] : undefined);
</script>
<div data-purpose="currency" data-currency={currency}>
  <InputField {...props} input={{ ...input, type: "text", inputMode: "decimal" }} {...(leadingSymbol ? { leadingSymbol } : {})} />
</div>
