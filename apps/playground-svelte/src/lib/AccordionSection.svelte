<script lang="ts">
  import { Accordion } from "@marwes-ui/svelte";

  let openItems = $state<Record<string, boolean>>({ item1: true, item2: false, item3: false });

  function toggle(id: string) {
    openItems[id] = !openItems[id];
  }
</script>

<section>
  <h2 class="section-title">Accordion</h2>

  <div class="accordion-list">
    <Accordion id="item1" title="What is Marwes?" open={openItems.item1} ontoggle={() => toggle("item1")}>
      Marwes is a design system with framework-agnostic core recipes and adapters for React, Vue, and Svelte.
    </Accordion>
    <Accordion id="item2" title="How does theming work?" open={openItems.item2} ontoggle={() => toggle("item2")}>
      Wrap your app in MarwesProvider with a theme config. CSS variables are injected automatically.
    </Accordion>
    <Accordion id="item3" title="Is it accessible?" open={openItems.item3} ontoggle={() => toggle("item3")}>
      Yes — all components follow WAI-ARIA patterns with proper aria attributes, keyboard navigation, and screen reader support.
    </Accordion>
  </div>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .accordion-list { display: flex; flex-direction: column; gap: 4px; }
</style>
