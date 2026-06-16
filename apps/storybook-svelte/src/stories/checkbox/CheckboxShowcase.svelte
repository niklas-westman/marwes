<script lang="ts">
  import { Paragraph } from "@marwes-ui/svelte"
  // Atom is no longer publicly exported; deep-import for story documentation.
  import Checkbox from "../../../../../packages/svelte/src/lib/components/checkbox/Checkbox.svelte"

  interface Props {
    showcase:
      | "all-states"
      | "controlled"
      | "disabled"
      | "indeterminate"
      | "invalid"
      | "sizes"
      | "uncontrolled"
  }

  const { showcase }: Props = $props()

  let controlledChecked = $state(false)
  let indeterminateChecked = $state(false)
  let indeterminate = $state(true)
</script>

{#if showcase === "all-states"}
  <div style="display: grid; gap: 16px;">
    <div>
      <Paragraph size="sm" style="margin-bottom: 8px; font-weight: 600;">Default States</Paragraph>
      <div style="display: flex; gap: 16px; align-items: center;">
        <Checkbox ariaLabel="Unchecked" />
        <Checkbox ariaLabel="Checked" checked={true} />
        <Checkbox ariaLabel="Indeterminate" indeterminate={true} />
      </div>
    </div>

    <div>
      <Paragraph size="sm" style="margin-bottom: 8px; font-weight: 600;">Disabled States</Paragraph>
      <div style="display: flex; gap: 16px; align-items: center;">
        <Checkbox ariaLabel="Disabled unchecked" disabled={true} />
        <Checkbox ariaLabel="Disabled checked" disabled={true} checked={true} />
        <Checkbox ariaLabel="Disabled indeterminate" disabled={true} indeterminate={true} />
      </div>
    </div>

    <div>
      <Paragraph size="sm" style="margin-bottom: 8px; font-weight: 600;">Error States</Paragraph>
      <div style="display: flex; gap: 16px; align-items: center;">
        <Checkbox ariaLabel="Error unchecked" invalid={true} />
        <Checkbox ariaLabel="Error checked" invalid={true} checked={true} />
      </div>
    </div>
  </div>
{:else if showcase === "controlled"}
  <div style="display: grid; gap: 12px;">
    <Checkbox ariaLabel="Controlled" checked={controlledChecked} oncheckedchange={(next) => (controlledChecked = next)} />
    <Paragraph size="sm">checked: {String(controlledChecked)}</Paragraph>
  </div>
{:else if showcase === "indeterminate"}
  <div style="display: grid; gap: 12px;">
    <Checkbox
      ariaLabel="Indeterminate"
      checked={indeterminateChecked}
      {indeterminate}
      oncheckedchange={(next) => {
        indeterminate = false
        indeterminateChecked = next
      }}
    />
    <Paragraph size="sm">
      checked: {String(indeterminateChecked)}, indeterminate: {String(indeterminate)}
    </Paragraph>
  </div>
{:else if showcase === "disabled"}
  <div style="display: grid; gap: 12px;">
    <Checkbox ariaLabel="Disabled unchecked" disabled={true} />
    <Checkbox ariaLabel="Disabled checked" disabled={true} checked={true} />
  </div>
{:else if showcase === "invalid"}
  <div style="display: grid; gap: 12px;">
    <Checkbox ariaLabel="Invalid unchecked" invalid={true} />
    <Checkbox ariaLabel="Invalid checked" invalid={true} checked={true} />
  </div>
{:else if showcase === "sizes"}
  <div style="display: grid; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <Checkbox ariaLabel="Small" size="sm" />
      <Paragraph size="sm">sm (1rem)</Paragraph>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <Checkbox ariaLabel="Medium" size="md" />
      <Paragraph size="sm">md (1.125rem)</Paragraph>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <Checkbox ariaLabel="Large" size="lg" />
      <Paragraph size="sm">lg (1.375rem)</Paragraph>
    </div>
  </div>
{:else if showcase === "uncontrolled"}
  <Checkbox ariaLabel="Uncontrolled" defaultChecked={true} />
{/if}
