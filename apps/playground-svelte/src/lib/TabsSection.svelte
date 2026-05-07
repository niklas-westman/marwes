<script lang="ts">
  import { TabGroup } from "@marwes-ui/svelte";

  let activeTab = $state("overview");
</script>

<section>
  <h2 class="section-title">Tabs</h2>

  <TabGroup
    label="Documentation"
    tabs={[
      { value: "overview", label: "Overview", panel: "This is the overview panel content. It shows general information about the component." },
      { value: "api", label: "API", panel: "API reference with props, types, and usage examples." },
      { value: "examples", label: "Examples", panel: "Live code examples and common patterns." },
      { value: "disabled", label: "Disabled", panel: "Cannot see this.", disabled: true },
    ]}
    activeTab={activeTab}
    onactivetabchange={(v) => activeTab = v}
  />
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
</style>
