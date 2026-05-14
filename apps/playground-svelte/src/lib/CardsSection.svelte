<script lang="ts">
  import { Card } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Cards</h2>
  <p class="description">With title and body-only</p>

  <div class="row">
    <div class="card-wrapper">
      <Card title="Getting started">
        Install via pnpm and wrap your app with MarwesProvider to unlock theming.
      </Card>
    </div>
    <div class="card-wrapper">
      <Card>
        Body-only card — no title. The body receives full top padding automatically.
      </Card>
    </div>
  </div>
</section>

<style>
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    opacity: 0.8;
  }

  .description {
    font-size: 13px;
    opacity: 0.6;
    margin: 0 0 12px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
  }

  .card-wrapper {
    width: 280px;
  }
</style>
