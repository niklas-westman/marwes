<script lang="ts">
  import { SegmentedControlField } from "@marwes-ui/svelte"

  let density = $state("compact")
  let mode = $state("compact")
  let theme = $state("light")
</script>

<SegmentedControlField
  label="View density"
  segmentedControl={{ items: [
    { value: "compact", label: "Compact" },
    { value: "wide", label: "Wide" },
  ], value: density, onvaluechange: (value) => (density = value), variant: "inverse", fullWidth: true }}
/>
<SegmentedControlField
  label="View mode"
  segmentedControl={{ items: [
    { value: "compact", label: "Compact" },
    { value: "wide", label: "Wide" },
    { value: "rich", label: "Rich" },
  ], value: mode, onvaluechange: (value) => (mode = value), variant: "inverse", fullWidth: true }}
/>
<SegmentedControlField
  label="Theme"
  segmentedControl={{ items: [
    { value: "light", ariaLabel: "Light" },
    { value: "dark", ariaLabel: "Dark" },
  ], value: theme, onvaluechange: (value) => (theme = value), variant: "inverse", size: "sm" }}
/>
