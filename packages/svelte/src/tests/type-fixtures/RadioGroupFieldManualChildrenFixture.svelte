<script lang="ts">
  import RadioGroupField from "../../lib/components/radio/RadioGroupField.svelte";
  import Radio from "../../lib/components/radio/Radio.svelte";

  let { groupDisabled = false }: { groupDisabled?: boolean } = $props();
</script>

<RadioGroupField label="Plan" disabled={groupDisabled}>
  <Radio name="plan" value="a" ariaLabel="Alpha" />
  <Radio name="plan" value="b" ariaLabel="Beta" disabled />
  <Radio name="plan" value="c" ariaLabel="Gamma" />
</RadioGroupField>
