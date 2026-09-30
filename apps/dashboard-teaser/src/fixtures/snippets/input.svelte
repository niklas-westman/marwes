<script lang="ts">
  import { CurrencyField, EmailField, PhoneField } from "@marwes-ui/svelte"

  let amount = $state("")
  let email = $state("")
  let phone = $state("")
</script>

<CurrencyField
  label="Amount"
  currency="USD"
  value={amount}
  input={{
    placeholder: "0.00",
    oninput: (event: Event & { currentTarget: HTMLInputElement }) =>
      (amount = event.currentTarget.value),
  }}
/>
<EmailField
  label="Email"
  value={email}
  input={{
    placeholder: "you@example.com",
    oninput: (event: Event & { currentTarget: HTMLInputElement }) =>
      (email = event.currentTarget.value),
  }}
/>
<PhoneField
  label="Phone"
  value={phone}
  input={{
    placeholder: "+1 (555) 000-0000",
    oninput: (event: Event & { currentTarget: HTMLInputElement }) =>
      (phone = event.currentTarget.value),
  }}
/>
