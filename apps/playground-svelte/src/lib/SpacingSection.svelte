<script lang="ts">
  import { Spacing, Spacings } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Spacing</h2>
  <p class="description">Decorative spacing divs with token-based sizes</p>

  <div class="spacing-demo">
    <div class="spacing-row">
      <span class="spacing-label">sp-8</span>
      <div class="spacing-visual"><Spacing size={Spacings.sp8} /></div>
    </div>
    <div class="spacing-row">
      <span class="spacing-label">sp-16</span>
      <div class="spacing-visual"><Spacing size={Spacings.sp16} /></div>
    </div>
    <div class="spacing-row">
      <span class="spacing-label">sp-24</span>
      <div class="spacing-visual"><Spacing size={Spacings.sp24} /></div>
    </div>
    <div class="spacing-row">
      <span class="spacing-label">sp-48</span>
      <div class="spacing-visual"><Spacing size={Spacings.sp48} /></div>
    </div>
    <div class="spacing-row">
      <span class="spacing-label">sp-80</span>
      <div class="spacing-visual"><Spacing size={Spacings.sp80} /></div>
    </div>
  </div>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .description { font-size: 13px; opacity: 0.6; margin: 0 0 12px; }
  .spacing-demo { display: flex; flex-direction: column; gap: 8px; }
  .spacing-row { display: flex; align-items: center; gap: 12px; }
  .spacing-label { font-size: 12px; font-family: monospace; opacity: 0.5; width: 50px; }
  .spacing-visual { background: rgba(91, 140, 255, 0.1); border: 1px dashed rgba(91, 140, 255, 0.3); border-radius: 4px; width: 200px; }
</style>
