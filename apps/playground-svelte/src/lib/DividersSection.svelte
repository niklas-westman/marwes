<script lang="ts">
  import { Divider, Paragraph } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Dividers</h2>
  <p class="description">Spacing dividers from xxs (1px) to lg (48px)</p>

  <Divider size="xxs" />
  <Paragraph size="sm">xxs — 1px</Paragraph>
  <Divider size="xs" />
  <Paragraph size="sm">xs — 8px</Paragraph>
  <Divider size="sm" />
  <Paragraph size="sm">sm — 16px</Paragraph>
  <Divider size="md" />
  <Paragraph size="sm">md — 32px</Paragraph>
  <Divider size="lg" />
  <Paragraph size="sm">lg — 48px</Paragraph>
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
</style>
