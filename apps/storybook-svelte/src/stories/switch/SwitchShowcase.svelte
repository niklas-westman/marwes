<script lang="ts">
  // Atom is no longer publicly exported; deep-import for story documentation.
  import Switch from "../../../../../packages/svelte/src/lib/components/switch/Switch.svelte"
  import { SwitchSize } from "@marwes-ui/core"

  interface Props {
    showcase?: "states" | "sizes"
  }

  let { showcase = "states" }: Props = $props()

  let startsOff = $state(false)
  let startsOn = $state(true)
  let interactive = $state(false)
  let compact = $state(false)
  let wide = $state(true)
  let rich = $state(false)
</script>

{#if showcase === "states"}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Starts off</p>
      <Switch checked={startsOff} oncheckedchange={(next) => (startsOff = next)}>
        Enable notifications
      </Switch>
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Starts on</p>
      <Switch checked={startsOn} oncheckedchange={(next) => (startsOn = next)}>
        Enable notifications
      </Switch>
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled off</p>
      <Switch disabled>Disabled setting</Switch>
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled on</p>
      <Switch checked disabled>Locked setting</Switch>
    </div>
    <div>
      <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Interactive</p>
      <Switch checked={interactive} oncheckedchange={(next) => (interactive = next)}>
        {interactive ? "On" : "Off"}
      </Switch>
    </div>
  </div>
{:else}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <Switch
      size={SwitchSize.compact}
      checked={compact}
      oncheckedchange={(next) => (compact = next)}
    >
      Compact 24x16
    </Switch>
    <Switch size={SwitchSize.wide} checked={wide} oncheckedchange={(next) => (wide = next)}>
      Wide 30x16
    </Switch>
    <Switch size={SwitchSize.rich} checked={rich} oncheckedchange={(next) => (rich = next)}>
      Rich 30x20
    </Switch>
  </div>
{/if}
