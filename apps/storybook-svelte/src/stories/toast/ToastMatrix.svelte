<script lang="ts">
  import {
    ErrorToast,
    H1,
    InfoToast,
    Paragraph,
    SuccessToast,
    Toast,
    WarningToast,
    Icon,
    MarwesProvider,
    ThemeMode,
  } from "@marwes-ui/svelte"
  import { IconName } from "@marwes-ui/core"

  interface Props {
    dark?: boolean
  }

  let { dark = false }: Props = $props()

  const title = $derived(dark ? "Toast — Dark" : "Toast")
  const caption = "Outline (default) · Subtle (quiet) · Rich (high-emphasis, use sparingly)"

  const variants = [
    { label: "SUBTLE", variant: "subtle" as const },
    { label: "OUTLINE", variant: "outline" as const },
    { label: "RICH", variant: "rich" as const },
  ]

  type MatrixEntry = { key: string; label: string; intent: string }

  const entries: MatrixEntry[] = [
    { key: "info", label: "Information", intent: "info" },
    { key: "success", label: "Success", intent: "success" },
    { key: "warning", label: "Warning", intent: "warning" },
    { key: "error", label: "Error", intent: "error" },
  ]

  const bgColor = $derived(dark ? "#2e2e2e" : "#ffffff")
  const textColor = $derived(dark ? "#f9fafb" : "#141414")
  const mutedColor = $derived(dark ? "#a3a3a3" : "#595959")
  const dividerColor = $derived(dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)")
</script>

<MarwesProvider theme={{ mode: dark ? ThemeMode.dark : ThemeMode.light }}>
  <div
    style="background: {bgColor}; color: {textColor}; min-height: 100vh; padding: 48px;"
  >
    <div style="max-width: 1144px;">
      <H1>{title}</H1>
      <Paragraph size="sm" style="color: {mutedColor};">
        {caption}
      </Paragraph>

      <div style="height: 32px;"></div>

      {#each variants as row, rowIndex (row.variant)}
        {#if rowIndex > 0}
          <div style="width: 100%; height: 1px; background: {dividerColor};" aria-hidden="true"></div>
          <div style="height: 24px;"></div>
        {/if}

        <Paragraph size="sm" style="color: {mutedColor}; font-weight: 500; letter-spacing: 0.08em;">
          {row.label}
        </Paragraph>

        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
          {#each entries as entry (entry.key)}
            <div style="flex: 0 0 360px; width: 360px;">
              {#if entry.intent === "info"}
                <InfoToast variant={row.variant} class="mw-toast--figma-matrix">
                  Meeting starts in 10 min
                </InfoToast>
              {:else if entry.intent === "success"}
                <SuccessToast variant={row.variant} class="mw-toast--figma-matrix">
                  Your email is verified
                </SuccessToast>
              {:else if entry.intent === "warning"}
                <WarningToast variant={row.variant} class="mw-toast--figma-matrix">
                  Connection unstable
                </WarningToast>
              {:else if entry.intent === "error"}
                <ErrorToast variant={row.variant} class="mw-toast--figma-matrix">
                  Something went wrong
                </ErrorToast>
              {/if}
            </div>
          {/each}
        </div>

        {#if rowIndex < variants.length - 1}
          <div style="height: 24px;"></div>
        {/if}
      {/each}
    </div>
  </div>
</MarwesProvider>

<style>
  :global(.mw-toast--figma-matrix) {
    width: 100%;
    min-width: 0;
    max-width: none;
  }
</style>
