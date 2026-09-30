<script setup lang="ts">
import { ref } from "vue"
import { CurrencyField, EmailField, PhoneField } from "@marwes-ui/vue"

const amount = ref("")
const email = ref("")
const phone = ref("")
</script>

<template>
  <CurrencyField
    v-model="amount"
    label="Amount"
    currency="USD"
    :input="{ placeholder: '0.00' }"
  />
  <EmailField
    v-model="email"
    label="Email"
    :input="{ placeholder: 'you@example.com' }"
  />
  <PhoneField
    v-model="phone"
    label="Phone"
    :input="{ placeholder: '+1 (555) 000-0000' }"
  />
</template>
