<script lang="ts">
  import {
    Button,
    ButtonVariant,
    CheckboxField,
    EmailField,
    MarwesProvider,
    SubmitButton,
  } from "@marwes-ui/svelte"

  let email = $state("")
  let subscribed = $state(false)
</script>

<MarwesProvider>
  <EmailField
    label="Email"
    value={email}
    input={{
      placeholder: "you@example.com",
      oninput: (event: Event & { currentTarget: HTMLInputElement }) =>
        (email = event.currentTarget.value),
    }}
  />
  <CheckboxField
    label="Send me product updates"
    bind:checked={subscribed}
  />
  <Button variant={ButtonVariant.secondary}>Preview</Button>
  <SubmitButton>Save</SubmitButton>
</MarwesProvider>
