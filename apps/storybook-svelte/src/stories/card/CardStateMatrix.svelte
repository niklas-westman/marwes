<script lang="ts">
  import { Card, MarwesProvider, Paragraph, ThemeMode } from "@marwes-ui/svelte"

  const cardStatePreviews = [
    {
      label: "Default",
      title: "Card title",
      className: "",
      children: "Resting state with the default border and neutral surface.",
    },
    {
      label: "Hover",
      title: "Card title",
      className: "mw-card--state-hover",
      children: "Hover state uses the darker border from the live Figma sync.",
    },
    {
      label: "Pressed",
      title: "Card title",
      className: "mw-card--state-pressed",
      children: "Pressed state keeps the stronger border treatment.",
    },
    {
      label: "Disabled",
      title: "Card title",
      className: "mw-card--disabled",
      ariaDisabled: true,
      children: "Disabled state mutes the surface and typography.",
    },
    {
      label: "Focus",
      title: "Card title",
      className: "mw-card--state-focus",
      children: "Focus state previews the keyboard border color from Figma.",
    },
  ]
</script>

<div style="display: flex; flex-direction: column; gap: 24px;">
  <div style="display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(320px, 1fr));">
    {#each cardStatePreviews as preview}
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Paragraph size="sm">{preview.label}</Paragraph>
        <Card title={preview.title} class={preview.className} ariaDisabled={preview.ariaDisabled}>{preview.children}</Card>
      </div>
    {/each}
  </div>

  <MarwesProvider theme={{ mode: ThemeMode.dark }}>
    <div style="display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(320px, 1fr)); padding: 24px; background: #2e2e2e; border-radius: 12px;">
      {#each cardStatePreviews as preview}
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <Paragraph size="sm">{preview.label}</Paragraph>
          <Card title={preview.title} class={preview.className} ariaDisabled={preview.ariaDisabled}>{preview.children}</Card>
        </div>
      {/each}
    </div>
  </MarwesProvider>
</div>
