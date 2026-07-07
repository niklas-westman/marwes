import type { Framework } from "../installation-recipes"

const react = `import { CurrencyField, EmailField, PhoneField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  return (
    <>
      <CurrencyField
        label="Amount"
        currency="USD"
        input={{ placeholder: "0.00", value: amount, onValueChange: setAmount }}
      />
      <EmailField
        label="Email"
        input={{ placeholder: "you@example.com", value: email, onValueChange: setEmail }}
      />
      <PhoneField
        label="Phone"
        input={{ placeholder: "+1 (555) 000-0000", value: phone, onValueChange: setPhone }}
      />
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { ref } from "vue"
import { CurrencyField, EmailField, PhoneField } from "@marwes-ui/vue"

const amount = ref("")
const email = ref("")
const phone = ref("")
</script>

<template>
  <CurrencyField
    label="Amount"
    currency="USD"
    :input="{ placeholder: '0.00', value: amount, onValueChange: (v) => (amount = v) }"
  />
  <EmailField
    label="Email"
    :input="{ placeholder: 'you@example.com', value: email, onValueChange: (v) => (email = v) }"
  />
  <PhoneField
    label="Phone"
    :input="{ placeholder: '+1 (555) 000-0000', value: phone, onValueChange: (v) => (phone = v) }"
  />
</template>
`

const svelte = `<script lang="ts">
  import { CurrencyField, EmailField, PhoneField } from "@marwes-ui/svelte"

  let amount = $state("")
  let email = $state("")
  let phone = $state("")
</script>

<CurrencyField
  label="Amount"
  currency="USD"
  input={{ placeholder: "0.00", value: amount, onValueChange: (v) => (amount = v) }}
/>
<EmailField
  label="Email"
  input={{ placeholder: "you@example.com", value: email, onValueChange: (v) => (email = v) }}
/>
<PhoneField
  label="Phone"
  input={{ placeholder: "+1 (555) 000-0000", value: phone, onValueChange: (v) => (phone = v) }}
/>
`

const inputSnippets: Record<Framework, string> = { react, vue, svelte }

export { inputSnippets }
