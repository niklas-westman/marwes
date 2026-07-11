<script lang="ts">
  import { Breadcrumb } from "@marwes-ui/svelte";

  const items = [
    { label: "Components", href: "#" },
    { label: "Navigation", href: "#" },
    { label: "Breadcrumb" },
  ];
</script>

<div style="display:flex;flex-direction:column;gap:24px">
  <Breadcrumb homeHref="#" {items} ariaLabel="Default breadcrumb" />
  <Breadcrumb showHome={false} {items} ariaLabel="No home breadcrumb" />
  <Breadcrumb homeHref="#" items={[{ label: "Current page" }]} ariaLabel="Single page breadcrumb" />
</div>
