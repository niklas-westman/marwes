<script lang="ts">
  import { createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Banner from "./Banner.svelte";
  import type { BannerProps } from "./types.js";

  let { variant: _variant, dataAttributes, ...props }: BannerProps = $props();
</script>

<Banner
  {...props}
  variant="info"
  dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("info-banner") }}
/>
