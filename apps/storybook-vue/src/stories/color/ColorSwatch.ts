import { Paragraph } from "@marwes-ui/vue"
import { computed, defineComponent, h, ref } from "vue"

export interface ColorSwatchProps {
  name: string
  hex: string
  cssVar: string
  description?: string
  usage?: string
}

export const ColorSwatch = defineComponent({
  name: "StoryColorSwatch",
  props: {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    cssVar: { type: String, required: true },
    description: String,
    usage: String,
  },
  setup(props) {
    const copied = ref<"hex" | "var" | null>(null)

    const copyToClipboard = (text: string, type: "hex" | "var") => {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(text)
      }
      copied.value = type
      setTimeout(() => {
        copied.value = null
      }, 2000)
    }

    const textColor = computed(() => {
      const toLinear = (channel: number) => {
        const value = channel / 255
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      }
      const luminance = ([r, g, b]: [number, number, number]) =>
        0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
      const contrast = (
        foreground: [number, number, number],
        background: [number, number, number],
      ) => {
        const lighter = Math.max(luminance(foreground), luminance(background))
        const darker = Math.min(luminance(foreground), luminance(background))
        return (lighter + 0.05) / (darker + 0.05)
      }
      const compositeOverWhite = ([r, g, b, a]: [number, number, number, number]) =>
        [
          Math.round(r * a + 255 * (1 - a)),
          Math.round(g * a + 255 * (1 - a)),
          Math.round(b * a + 255 * (1 - a)),
        ] as [number, number, number]

      const rgbaMatch = props.hex.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i)
      const rgba = rgbaMatch
        ? ([
            Number(rgbaMatch[1]),
            Number(rgbaMatch[2]),
            Number(rgbaMatch[3]),
            Number(rgbaMatch[4] ?? 1),
          ] as [number, number, number, number])
        : undefined

      const value = props.hex.replace("#", "")
      const normalized =
        value.length === 3
          ? value
              .split("")
              .map((part) => `${part}${part}`)
              .join("")
          : value
      const hexRgba = /^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(normalized)
        ? ([
            Number.parseInt(normalized.slice(0, 2), 16),
            Number.parseInt(normalized.slice(2, 4), 16),
            Number.parseInt(normalized.slice(4, 6), 16),
            normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1,
          ] as [number, number, number, number])
        : undefined

      const background = rgba ?? hexRgba
      if (!background) return "#141414"

      const renderedBackground = compositeOverWhite(background)
      const black: [number, number, number] = [0, 0, 0]
      const white: [number, number, number] = [255, 255, 255]

      return contrast(black, renderedBackground) >= contrast(white, renderedBackground)
        ? "#141414"
        : "#FFFFFF"
    })

    return () =>
      h("div", { class: "color-swatch" }, [
        h(
          "div",
          {
            class: "color-swatch__preview",
            style: { backgroundColor: props.hex },
          },
          [
            h("div", { class: "color-swatch__hex-on-color" }, [
              h(
                Paragraph,
                { style: { color: textColor.value } },
                {
                  default: () => [props.hex],
                },
              ),
            ]),
          ],
        ),
        h("div", { class: "color-swatch__info" }, [
          h(
            Paragraph,
            { className: "color-swatch__name" },
            {
              default: () => [props.name],
            },
          ),
          h("div", { class: "color-swatch__values" }, [
            h(
              "button",
              {
                type: "button",
                class: "color-swatch__value",
                onClick: () => copyToClipboard(props.hex, "hex"),
                title: "Click to copy hex value",
              },
              [
                h(
                  Paragraph,
                  { size: "sm", className: "color-swatch__value-label" },
                  { default: () => ["HEX:"] },
                ),
                h(
                  Paragraph,
                  { size: "sm", className: "color-swatch__value-text" },
                  { default: () => [props.hex] },
                ),
                copied.value === "hex" ? h("span", { class: "color-swatch__copied" }, "✓") : null,
              ],
            ),
            h(
              "button",
              {
                type: "button",
                class: "color-swatch__value",
                onClick: () => copyToClipboard(props.cssVar, "var"),
                title: "Click to copy CSS variable",
              },
              [
                h(
                  Paragraph,
                  { size: "sm", className: "color-swatch__value-label" },
                  { default: () => ["CSS:"] },
                ),
                h(
                  Paragraph,
                  { size: "sm", className: "color-swatch__value-text" },
                  { default: () => [props.cssVar] },
                ),
                copied.value === "var" ? h("span", { class: "color-swatch__copied" }, "✓") : null,
              ],
            ),
          ]),
          props.description
            ? h(
                Paragraph,
                { size: "sm", className: "color-swatch__description" },
                { default: () => [props.description ?? ""] },
              )
            : null,
          props.usage
            ? h(
                Paragraph,
                { size: "sm", className: "color-swatch__usage" },
                {
                  default: () => [h("strong", "Usage:"), " ", props.usage ?? ""],
                },
              )
            : null,
        ]),
      ])
  },
})
