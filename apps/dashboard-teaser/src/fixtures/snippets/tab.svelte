<script lang="ts">
  import { NavigationTabs } from "@marwes-ui/svelte"

  const tabs = [
    { value: "overview", label: "Overview", panel: "Account overview" },
    { value: "activity", label: "Activity", panel: "Recent account activity" },
  ]
</script>

<NavigationTabs label="Account" {tabs} defaultActiveTab="overview" />
