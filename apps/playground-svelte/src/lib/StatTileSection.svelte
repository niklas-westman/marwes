<script lang="ts">
  import { StatTile } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Stat Tile</h2>

  <div class="grid">
    <StatTile label="Revenue" value="$12,345" subtitle="Last 30 days" />
    <StatTile label="Users" value="1,234" trendValue="+12%" trendDirection="positive" tone="success" />
    <StatTile label="Churn" value="3.2%" trendValue="-0.5%" trendDirection="negative" tone="danger" />
    <StatTile label="Orders" value="856" trendValue="+5%" trendDirection="positive" tone="brand" />
  </div>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
</style>
