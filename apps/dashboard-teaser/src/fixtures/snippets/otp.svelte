<script lang="ts">
  import { InputOtpField } from "@marwes-ui/svelte"

  let value = $state("")
</script>

<InputOtpField
  label="Verification code"
  helperText="Enter the 6-digit code sent to your email"
  inputOtp={{ length: 6, value, onvaluechange: (nextValue) => (value = nextValue) }}
/>
