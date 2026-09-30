<script lang="ts">
  import { SwitchField } from "@marwes-ui/svelte"

  let checked = $state(false)
</script>

<SwitchField
  label="Label"
  switch={{ checked, oncheckedchange: (nextChecked) => (checked = nextChecked) }}
/>
