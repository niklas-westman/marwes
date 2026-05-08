<script lang="ts">
  import { Paragraph } from "@marwes-ui/svelte"

  interface Props {
    name: string
    hex: string
    cssVar: string
    description?: string
    usage?: string
  }

  let { name, hex, cssVar, description, usage }: Props = $props()

  let copied = $state<"hex" | "var" | null>(null)

  function getContrastColor(hexColor: string): string {
    const toLinear = (channel: number) => {
      const value = channel / 255
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    }
    const luminance = ([r, g, b]: [number, number, number]) =>
      0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

    const raw = hexColor.replace("#", "")
    const normalized =
      raw.length === 3
        ? raw.split("").map((c) => `${c}${c}`).join("")
        : raw

    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(normalized)) return "#141414"

    const r = Number.parseInt(normalized.slice(0, 2), 16)
    const g = Number.parseInt(normalized.slice(2, 4), 16)
    const b = Number.parseInt(normalized.slice(4, 6), 16)
    const lum = luminance([r, g, b])

    return lum > 0.179 ? "#141414" : "#FFFFFF"
  }

  function copyToClipboard(text: string, type: "hex" | "var"): void {
    navigator.clipboard.writeText(text)
    copied = type
    setTimeout(() => { copied = null }, 2000)
  }

  const textColor = $derived(getContrastColor(hex))
</script>

<div class="color-swatch">
  <div class="color-swatch__preview" style="background-color: {hex};">
    <Paragraph style="color: {textColor};">{hex}</Paragraph>
  </div>

  <div class="color-swatch__info">
    <Paragraph>{name}</Paragraph>

    <div class="color-swatch__values">
      <button
        type="button"
        class="color-swatch__value"
        onclick={() => copyToClipboard(hex, "hex")}
        title="Click to copy hex value"
      >
        <Paragraph size="sm" class="color-swatch__value-label">HEX:</Paragraph>
        <Paragraph size="sm" class="color-swatch__value-text">{hex}</Paragraph>
        {#if copied === "hex"}
          <span class="color-swatch__copied" aria-hidden="true">✓</span>
        {/if}
      </button>

      <button
        type="button"
        class="color-swatch__value"
        onclick={() => copyToClipboard(cssVar, "var")}
        title="Click to copy CSS variable"
      >
        <Paragraph size="sm" class="color-swatch__value-label">CSS:</Paragraph>
        <Paragraph size="sm" class="color-swatch__value-text">{cssVar}</Paragraph>
        {#if copied === "var"}
          <span class="color-swatch__copied" aria-hidden="true">✓</span>
        {/if}
      </button>
    </div>

    {#if description}
      <Paragraph size="sm">{description}</Paragraph>
    {/if}

    {#if usage}
      <Paragraph size="sm"><strong>Usage:</strong> {usage}</Paragraph>
    {/if}
  </div>
</div>

<style>
  .color-swatch {
    display: flex;
    flex-direction: column;
    border: 1px solid #d8d8d8;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    color: #141414;
    transition: box-shadow 0.2s;
  }
  .color-swatch:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .color-swatch__preview {
    height: 120px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 12px;
    font-weight: 500;
    font-size: 14px;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
  }
  .color-swatch__info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #141414;
  }
  .color-swatch__values {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .color-swatch__value {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: #f9fafb;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    font-size: 13px;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }
  .color-swatch__value:hover {
    background: #f5f5f5;
    border-color: #a3a3a3;
  }
  .color-swatch__value:active {
    background: #d8d8d8;
  }
  .color-swatch__copied {
    color: #006633;
    font-weight: 700;
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
