<script lang="ts">
  import { OptionRadioGroup } from "@marwes-ui/svelte"

  let value = $state("1")
</script>

<OptionRadioGroup
  name="options"
  label="Group label"
  options={[
    { value: "1", label: "Label" },
    { value: "2", label: "Label" },
    { value: "3", label: "Label" },
  ]}
  {value}
  onchange={(nextValue) => (value = nextValue)}
/>
