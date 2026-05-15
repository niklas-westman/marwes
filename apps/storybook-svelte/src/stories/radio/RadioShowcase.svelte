<script lang="ts">
  import { Paragraph, Radio } from "@marwes-ui/svelte"

  interface Props {
    showcase: "all-states" | "radio-group"
  }

  const { showcase }: Props = $props()

  let selected = $state("a")

  const options = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ]
</script>

{#if showcase === "radio-group"}
  <div role="radiogroup" aria-label="Preference" style="display: flex; flex-direction: column; gap: 12px;">
    {#each options as option (option.value)}
      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
        <Radio
          name="preference"
          value={option.value}
          checked={selected === option.value}
          oncheckedchange={(checked) => {
            if (checked) selected = option.value
          }}
        />
        <Paragraph size="sm">{option.label}</Paragraph>
      </label>
    {/each}
  </div>
{:else if showcase === "all-states"}
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <label style="display: flex; align-items: center; gap: 8px;">
      <Radio name="states" ariaLabel="Unchecked" />
      <Paragraph size="sm">Unchecked</Paragraph>
    </label>
    <label style="display: flex; align-items: center; gap: 8px;">
      <Radio name="states" ariaLabel="Checked" checked={true} />
      <Paragraph size="sm">Checked</Paragraph>
    </label>
    <label style="display: flex; align-items: center; gap: 8px;">
      <Radio name="states" ariaLabel="Disabled" disabled={true} />
      <Paragraph size="sm">Disabled</Paragraph>
    </label>
    <label style="display: flex; align-items: center; gap: 8px;">
      <Radio name="states" ariaLabel="Disabled + checked" disabled={true} checked={true} />
      <Paragraph size="sm">Disabled + checked</Paragraph>
    </label>
    <label style="display: flex; align-items: center; gap: 8px;">
      <Radio name="states" ariaLabel="Invalid" invalid={true} />
      <Paragraph size="sm">Invalid</Paragraph>
    </label>
  </div>
{/if}
