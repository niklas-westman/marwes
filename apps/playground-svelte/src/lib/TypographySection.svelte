<script lang="ts">
  import { H1, H2, H3, Paragraph, Divider } from "@marwes-ui/svelte";
</script>

<section>
  <h2 class="section-title">Typography</h2>
  <H1>Heading Level 1</H1>
  <H2>Heading Level 2</H2>
  <H3>Heading Level 3</H3>
  <Divider size="sm" />
  <Paragraph size="lg">
    Large paragraph for intros and hero sections. The type scale is fluid and responds to the density setting.
  </Paragraph>
  <Paragraph>
    Default body text. Color roles are derived from a single hex value — hover, pressed, disabled, and label contrast are all computed automatically.
  </Paragraph>
  <Paragraph size="sm">
    Small paragraph for captions, helper text, and secondary information.
  </Paragraph>
</section>

<style>
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    opacity: 0.8;
  }
</style>
