<script lang="ts">
  import "@marwes-ui/presets/firstEdition/styles.css";
  import {
    MarwesProvider,
    ThemeMode,
  } from "@marwes-ui/svelte";
  import type { ThemeInput } from "@marwes-ui/svelte";

  import TypographySection from "./lib/TypographySection.svelte";
  import ButtonsSection from "./lib/ButtonsSection.svelte";
  import InputFieldsSection from "./lib/InputFieldsSection.svelte";
  import TextareaSelectSection from "./lib/TextareaSelectSection.svelte";
  import CheckboxSwitchSection from "./lib/CheckboxSwitchSection.svelte";
  import RadioSection from "./lib/RadioSection.svelte";
  import BadgesSection from "./lib/BadgesSection.svelte";
  import CardsSection from "./lib/CardsSection.svelte";
  import DividersSection from "./lib/DividersSection.svelte";
  import SpacingSection from "./lib/SpacingSection.svelte";
  import IconsSection from "./lib/IconsSection.svelte";
  import SpinnersSection from "./lib/SpinnersSection.svelte";
  import AccordionSection from "./lib/AccordionSection.svelte";
  import TabsSection from "./lib/TabsSection.svelte";
  import SliderSection from "./lib/SliderSection.svelte";
  import AvatarSection from "./lib/AvatarSection.svelte";
  import SkeletonSection from "./lib/SkeletonSection.svelte";
  import StatTileSection from "./lib/StatTileSection.svelte";
  import ThemeControls from "./lib/ThemeControls.svelte";

  let mode: ThemeInput["mode"] = $state(ThemeMode.light);

  const theme: ThemeInput = $derived({
    mode,
    tone: "default",
    color: {
      primary: "#5B8CFF",
      danger: "#D90429",
      success: "#006633",
      warning: "#FFB703",
    },
    ui: { radius: 4, density: "comfortable" },
  });
</script>

<MarwesProvider {theme}>
  <div class="playground">
    <header class="playground__header">
      <h1 class="playground__title">Marwes — Svelte Playground</h1>
      <p class="playground__subtitle">
        Live preview of @marwes-ui/svelte components. All components use the same core recipes as React/Vue.
      </p>
      <ThemeControls bind:mode />
    </header>

    <main class="playground__main">
      <TypographySection />
      <hr class="playground__divider" />
      <ButtonsSection />
      <hr class="playground__divider" />
      <InputFieldsSection />
      <hr class="playground__divider" />
      <TextareaSelectSection />
      <hr class="playground__divider" />
      <CheckboxSwitchSection />
      <hr class="playground__divider" />
      <RadioSection />
      <hr class="playground__divider" />
      <SliderSection />
      <hr class="playground__divider" />
      <TabsSection />
      <hr class="playground__divider" />
      <AccordionSection />
      <hr class="playground__divider" />
      <BadgesSection />
      <hr class="playground__divider" />
      <CardsSection />
      <hr class="playground__divider" />
      <StatTileSection />
      <hr class="playground__divider" />
      <AvatarSection />
      <hr class="playground__divider" />
      <SkeletonSection />
      <hr class="playground__divider" />
      <DividersSection />
      <hr class="playground__divider" />
      <SpacingSection />
      <hr class="playground__divider" />
      <SpinnersSection />
      <hr class="playground__divider" />
      <IconsSection />
    </main>
  </div>
</MarwesProvider>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .playground {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .playground__header {
    margin-bottom: 48px;
  }

  .playground__title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  .playground__subtitle {
    font-size: 14px;
    opacity: 0.7;
    margin: 0 0 24px;
  }

  .playground__main {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .playground__divider {
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.1;
    margin: 0;
  }
</style>
