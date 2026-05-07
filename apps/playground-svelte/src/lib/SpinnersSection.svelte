<script lang="ts">
  import { Spinner, ButtonSpinner, EmptyStateSpinner } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Spinners</h2>

  <p class="description">Variants</p>
  <div class="row">
    <div class="spinner-cell">
      <Spinner variant="classic" size="md" ariaLabel="Loading" />
      <span class="spinner-label">classic</span>
    </div>
    <div class="spinner-cell">
      <Spinner variant="ring" size="md" ariaLabel="Loading" />
      <span class="spinner-label">ring</span>
    </div>
    <div class="spinner-cell">
      <Spinner variant="dual" size="md" ariaLabel="Loading" />
      <span class="spinner-label">dual</span>
    </div>
    <div class="spinner-cell">
      <Spinner variant="dots-round" size="md" ariaLabel="Loading" />
      <span class="spinner-label">dots-round</span>
    </div>
    <div class="spinner-cell">
      <Spinner variant="dots-square" size="md" ariaLabel="Loading" />
      <span class="spinner-label">dots-square</span>
    </div>
    <div class="spinner-cell">
      <Spinner variant="lines" size="md" ariaLabel="Loading" />
      <span class="spinner-label">lines</span>
    </div>
    <div class="spinner-cell">
      <Spinner variant="cross" size="md" ariaLabel="Loading" />
      <span class="spinner-label">cross</span>
    </div>
  </div>

  <p class="description">Sizes — xs through lg</p>
  <div class="row" style="align-items: center;">
    <Spinner size="xs" decorative />
    <Spinner size="sm" decorative />
    <Spinner size="md" decorative />
    <Spinner size="lg" decorative />
  </div>

  <p class="description">ButtonSpinner & EmptyStateSpinner</p>
  <div class="row">
    <ButtonSpinner />
    <ButtonSpinner inverted />
    <EmptyStateSpinner />
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
    margin: 0 0 8px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  .spinner-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .spinner-label {
    font-size: 11px;
    opacity: 0.5;
  }
</style>
