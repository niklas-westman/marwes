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
      const rgb = Number.parseInt(props.hex.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = rgb & 0xff
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      return luma > 165 ? "#000000" : "#FFFFFF"
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
