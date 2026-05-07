<script lang="ts">
  import { Skeleton } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Skeleton</h2>

  <p class="description">Text, Circular, Rectangular</p>
  <div class="row">
    <Skeleton variant="text" width={200} />
    <Skeleton variant="text" width={150} />
    <Skeleton variant="circular" />
    <Skeleton variant="rectangular" width={120} height={80} />
  </div>

  <p class="description">Card-like loading placeholder</p>
  <div class="card-skeleton">
    <Skeleton variant="rectangular" width="100%" height={120} />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
  </div>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .description { font-size: 13px; opacity: 0.6; margin: 0 0 8px; }
  .row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 20px; }
  .card-skeleton { display: flex; flex-direction: column; gap: 8px; width: 260px; padding: 16px; border: 1px solid rgba(128,128,128,0.1); border-radius: 8px; }
</style>
