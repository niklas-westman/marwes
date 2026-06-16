<script lang="ts">
  // Atom is no longer publicly exported; deep-import for playground demo.
  import Slider from "../../../../packages/svelte/src/lib/components/slider/Slider.svelte";

  let value1 = $state(50);
  let value2 = $state(25);
</script>

<section>
  <h2 class="section-title">Slider</h2>

  <div class="slider-grid">
    <div>
      <p class="description">Default (0–100)</p>
      <Slider min={0} max={100} bind:value={value1} ariaLabel="Volume" />
      <p class="value">{value1}</p>
    </div>
    <div>
      <p class="description">With step (0–100, step 25)</p>
      <Slider min={0} max={100} step={25} bind:value={value2} ariaLabel="Quality" />
      <p class="value">{value2}</p>
    </div>
    <div>
      <p class="description">Disabled</p>
      <Slider min={0} max={100} value={60} disabled ariaLabel="Disabled" />
    </div>
  </div>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .description { font-size: 13px; opacity: 0.6; margin: 0 0 8px; }
  .slider-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .value { font-size: 12px; font-family: monospace; opacity: 0.5; margin-top: 4px; }
</style>
