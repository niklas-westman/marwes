import {
  type StatTileOptions,
  type StatTileTone,
  type StatTileTrendDirection,
  createStatTileRecipe,
} from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export interface StatTileProps extends Pick<StatTileOptions, "dataAttributes"> {
  className?: string
  label: string
  value: string
  subtitle?: string
  trendValue?: string
  trendDirection?: StatTileTrendDirection
  tone?: StatTileTone
}

const statTilePropKeys = [
  "className",
  "label",
  "value",
  "subtitle",
  "trendValue",
  "trendDirection",
  "tone",
  "dataAttributes",
] as const

export const StatTile = defineComponent(
  (props: StatTileProps) => {
    const attrs = useAttrs()
    const renderKit = computed(() =>
      createStatTileRecipe({
        ...(props.tone !== undefined ? { tone: props.tone } : {}),
        ...(props.trendDirection !== undefined ? { trendDirection: props.trendDirection } : {}),
        ...(props.trendValue !== undefined ? { trendValue: props.trendValue } : {}),
        ...(props.dataAttributes !== undefined ? { dataAttributes: props.dataAttributes } : {}),
      }),
    )

    return () => {
      const kit = renderKit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])

      return h(
        "article",
        {
          ...passthroughAttrs,
          ...kit.dataAttributes,
          class: mergeClassNames(kit.className, props.className, attrs.class),
        },
        [
          h(
            "div",
            { class: kit.slots.headerClassName },
            [
              h("span", { class: kit.slots.labelClassName }, props.label),
              props.trendValue
                ? h(
                    "span",
                    {
                      ...kit.trendDataAttributes,
                      class: kit.slots.trendClassName,
                      "aria-label": kit.a11y.trendAriaLabel,
                    },
                    [
                      kit.trendIcon
                        ? h(
                            "span",
                            { class: kit.slots.trendIconClassName, "aria-hidden": "true" },
                            kit.trendIcon,
                          )
                        : null,
                      h("span", { class: kit.slots.trendValueClassName }, props.trendValue),
                    ].filter(Boolean),
                  )
                : null,
            ].filter(Boolean),
          ),
          h("div", { class: kit.slots.valueClassName }, props.value),
          props.subtitle ? h("div", { class: kit.slots.subtitleClassName }, props.subtitle) : null,
        ].filter(Boolean),
      )
    }
  },
  {
    name: "MarwesStatTile",
    inheritAttrs: false,
    props: [...statTilePropKeys],
  },
)
