<script lang="ts">
  import { CheckboxField, CheckboxGroupField } from "@marwes-ui/svelte"

  let checked = $state(false)
  let groupOne = $state(true)
  let groupTwo = $state(false)
  let groupThree = $state(false)
</script>

<CheckboxField
  label="Label"
  bind:checked
/>
<CheckboxGroupField label="Group label" description="Select all that apply">
  <CheckboxField label="First option" bind:checked={groupOne} />
  <CheckboxField label="Second option" bind:checked={groupTwo} />
  <CheckboxField label="Third option" bind:checked={groupThree} />
</CheckboxGroupField>
