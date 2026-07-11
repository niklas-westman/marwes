<script lang="ts">
  import type { SegmentedControlItem } from "@marwes-ui/svelte"
  // Atom is no longer publicly exported; deep-import for story documentation.
  import SegmentedControl from "../../../../../packages/svelte/src/lib/components/segmented-control/SegmentedControl.svelte"

  const twoItems: SegmentedControlItem[] = [
    { value: "compact", label: "Compact" },
    { value: "wide", label: "Wide" },
  ]

  const threeItems: SegmentedControlItem[] = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
  ]

  const iconItems: SegmentedControlItem[] = [
    { value: "light", label: "☀️", ariaLabel: "Light mode" },
    { value: "dark", label: "🌙", ariaLabel: "Dark mode" },
  ]

  let val1 = $state("react")
  let val2 = $state("react")
  let val3 = $state("light")
  let val4 = $state("compact")
  let val5 = $state("compact")
</script>

<div style="display: flex; flex-direction: column; gap: 24px;">
  <div>
    <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Default</p>
    <SegmentedControl
      items={threeItems}
      value={val1}
      ariaLabel="Framework"
      onvaluechange={(v) => { val1 = v }}
    />
  </div>
  <div>
    <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Inverse</p>
    <SegmentedControl
      items={threeItems}
      value={val2}
      variant="inverse"
      ariaLabel="Framework"
      onvaluechange={(v) => { val2 = v }}
    />
  </div>
  <div>
    <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Pill</p>
    <SegmentedControl
      items={iconItems}
      value={val3}
      variant="pill"
      ariaLabel="Theme"
      onvaluechange={(v) => { val3 = v }}
    />
  </div>
  <div>
    <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Small</p>
    <SegmentedControl
      items={twoItems}
      value={val4}
      size="sm"
      ariaLabel="Density"
      onvaluechange={(v) => { val4 = v }}
    />
  </div>
  <div>
    <p style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">Disabled</p>
    <SegmentedControl
      items={twoItems}
      value={val5}
      disabled
      ariaLabel="Density"
    />
  </div>
</div>
