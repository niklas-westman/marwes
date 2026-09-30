<script lang="ts">
  import { Breadcrumb } from "@marwes-ui/svelte"
</script>

<Breadcrumb
  homeHref="/"
  items={[
    { label: "Label", href: "/section" },
    { label: "Label", href: "/section/child" },
    { label: "Current page" },
  ]}
/>
