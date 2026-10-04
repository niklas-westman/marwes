<script lang="ts">
  import { PrimaryButton, SecondaryButton } from "@marwes-ui/svelte"
  import type { ButtonProps } from "@marwes-ui/svelte"

  let props: Omit<ButtonProps, "variant" | "as" | "children"> = $props()
  let submitted = $state(false)
</script>

<form onsubmit={(event) => { event.preventDefault(); submitted = true }}>
  <label>Name <input name="name" value="Marwes" /></label>
  <PrimaryButton {...props}>Submit form</PrimaryButton>
  <SecondaryButton type="reset">Reset form</SecondaryButton>
  <output>{submitted ? "Form submitted" : "Ready to submit"}</output>
</form>
