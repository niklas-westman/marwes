<script lang="ts">
  import { Checkbox, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    showcase: "all-states" | "controlled" | "playground" | "sizes" | "uncontrolled"
  }

  const { showcase }: Props = $props()

  let controlledChecked = $state(true)
  let playgroundChecked = $state(false)
</script>

{#if showcase === "all-states"}
  <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: center;">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Default</Paragraph>
      <Checkbox ariaLabel="Default" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Checked</Paragraph>
      <Checkbox ariaLabel="Checked" checked={true} />
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Indeterminate</Paragraph>
      <Checkbox ariaLabel="Indeterminate" indeterminate={true} />
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Disabled</Paragraph>
      <Checkbox ariaLabel="Disabled" disabled={true} />
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Invalid</Paragraph>
      <Checkbox ariaLabel="Invalid" invalid={true} />
    </div>
  </div>
{:else if showcase === "controlled"}
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <Checkbox ariaLabel="Controlled" checked={controlledChecked} onchange={() => (controlledChecked = !controlledChecked)} />
    <Paragraph size="sm">Checked: {controlledChecked}</Paragraph>
  </div>
{:else if showcase === "playground"}
  <Checkbox ariaLabel="Playground" checked={playgroundChecked} onchange={() => (playgroundChecked = !playgroundChecked)} />
{:else if showcase === "sizes"}
  <div style="display: flex; gap: 24px; align-items: center;">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Small</Paragraph>
      <Checkbox ariaLabel="Small" size="sm" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <Paragraph size="sm">Medium</Paragraph>
      <Checkbox ariaLabel="Medium" size="md" />
    </div>
  </div>
{:else if showcase === "uncontrolled"}
  <Checkbox ariaLabel="Uncontrolled default checked" defaultChecked={true} />
{/if}
