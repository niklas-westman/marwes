import type { Framework } from "../installation-recipes"

const react = `import { InputOtpField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("")

  return (
    <InputOtpField
      label="Verification code"
      helperText="Enter the 6-digit code sent to your email"
      inputOtp={{ length: 6, value, onValueChange: setValue }}
    />
  )
}
`

const vue = `<script setup lang="ts">
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
`

const svelte = `<script lang="ts">
  import { InputOtpField } from "@marwes-ui/svelte"

  let value = $state("")
</script>

<InputOtpField
  label="Verification code"
  helperText="Enter the 6-digit code sent to your email"
  inputOtp={{ length: 6, value, onValueChange: (v) => (value = v) }}
/>
`

const otpSnippets: Record<Framework, string> = { react, vue, svelte }

export { otpSnippets }
