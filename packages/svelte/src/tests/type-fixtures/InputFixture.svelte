<script lang="ts">
  import { Input, InputField } from "@marwes-ui/svelte"
  let name = $state("")
  let email = $state("")
</script>

<!-- Atom usage -->
<Input placeholder="Enter text" bind:value={name} />
<Input type="password" disabled />

<!-- Field usage -->
<InputField label="Full name" input={{ placeholder: "Jane Doe" }} bind:value={name} />
<InputField label="Email" helperText="We'll never share it." input={{ type: "email" }} bind:value={email} />
<InputField label="Password" error="Too short." input={{ type: "password" }} />
<InputField label="Amount" leadingSymbol="$" input={{ placeholder: "0.00" }} />
