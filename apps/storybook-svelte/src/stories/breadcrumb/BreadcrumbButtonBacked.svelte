<script lang="ts">
  import { Breadcrumb } from "@marwes-ui/svelte";

  let selected = $state("Components");

  const items = $derived([
    { value: "Components", label: "Components", current: selected === "Components" },
    { value: "Navigation", label: "Navigation", current: selected === "Navigation" },
    { value: "Breadcrumb", label: "Breadcrumb", current: selected === "Breadcrumb" },
  ]);
</script>

<Breadcrumb
  showHome={false}
  {items}
  onitemselect={(value) => {
    selected = value;
  }}
/>
