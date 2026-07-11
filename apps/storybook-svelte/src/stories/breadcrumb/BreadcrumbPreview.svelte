<script lang="ts">
  import { Breadcrumb } from "@marwes-ui/svelte";
  import type { BreadcrumbItem } from "@marwes-ui/svelte";

  export let items: BreadcrumbItem[] = [
    { label: "Components", href: "#" },
    { label: "Navigation", href: "#" },
    { label: "Breadcrumb" },
  ];
  export let homeHref: string | undefined = "#";
  export let showHome = true;
  export let ariaLabel: string | undefined = undefined;
</script>

<Breadcrumb {items} {homeHref} {showHome} {ariaLabel} />
