<script setup lang="ts">
import { ref } from "vue"
import { InputOtpField } from "@marwes-ui/vue"

const value = ref("")
</script>

<template>
  <InputOtpField
    label="Verification code"
    helper-text="Enter the 6-digit code sent to your email"
    :input-otp="{ length: 6, value, onValueChange: (v) => (value = v) }"
  />
</template>
