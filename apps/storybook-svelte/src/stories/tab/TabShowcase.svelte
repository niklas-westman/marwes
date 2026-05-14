<script lang="ts">
  import { Tab } from "@marwes-ui/svelte"

  interface Props {
    showcase?: "states" | "bar"
  }

  let { showcase = "states" }: Props = $props()
  let active = $state(0)
  const tabs = ["Overview", "Activity", "Settings"] as const
</script>

{#snippet atomPreview(label: string, selected = false, disabled = false, panelId = "panel-atom-tab")}
  <div>
    <div role="tablist" aria-label={`${label} tab`}>
      <Tab {selected} {disabled} ariaControls={panelId}>
        {label}
      </Tab>
    </div>
    <div id={panelId} role="tabpanel" aria-label={`${label} panel`} hidden={!selected}>
      {label}
    </div>
  </div>
{/snippet}

{#snippet tabBar()}
  <div>
    <div
      role="tablist"
      aria-label="Example tabs"
      style="display: flex; border-bottom: 1px solid #e5e7eb;"
    >
      {#each tabs as label, index (label)}
        <Tab
          selected={active === index}
          disabled={label === "Settings"}
          ariaControls={`panel-${index}`}
          onclick={() => {
            if (label !== "Settings") active = index
          }}
        >
          {label}
        </Tab>
      {/each}
    </div>
    {#each tabs as label, index (label)}
      <div id={`panel-${index}`} role="tabpanel" hidden={active !== index}>
        {label}
      </div>
    {/each}
  </div>
{/snippet}

{#if showcase === "states"}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Default / Inactive</p>
      {@render atomPreview("Overview", false, false, "panel-default")}
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Selected</p>
      {@render atomPreview("Overview", true, false, "panel-selected")}
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled</p>
      {@render atomPreview("Settings", false, true, "panel-disabled")}
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Tab bar</p>
      <div role="tablist" style="display: flex; border-bottom: 1px solid #e5e7eb;">
        <Tab selected ariaControls="panel-0">Overview</Tab>
        <Tab ariaControls="panel-1">Activity</Tab>
        <Tab disabled ariaControls="panel-2">Settings</Tab>
      </div>
      <div id="panel-0" role="tabpanel">Overview</div>
      <div id="panel-1" role="tabpanel" hidden>Activity</div>
      <div id="panel-2" role="tabpanel" hidden>Settings</div>
    </div>
  </div>
{:else}
  {@render tabBar()}
{/if}
