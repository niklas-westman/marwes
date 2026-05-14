<script lang="ts">
  import { Badge, BadgeGroup, BadgeVariant } from "@marwes-ui/svelte";

  const variants = Object.values(BadgeVariant) as string[];
</script>

<section>
  <h2 class="section-title">Badges</h2>

  <div class="row">
    {#each variants as v}
      <Badge variant={v as any}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
    {/each}
  </div>

  <div class="group-demo">
    <BadgeGroup label="Status">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
    </BadgeGroup>
  </div>
</section>

<style>
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    opacity: 0.8;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .group-demo {
    margin-top: 12px;
  }
</style>
