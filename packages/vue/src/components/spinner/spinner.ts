import { type SpinnerOptions, type SpinnerSvgNode, createSpinnerRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SpinnerProps = SpinnerOptions & {
  className?: string
  dataAttributes?: Record<string, string>
}

const spinnerPropKeys = [
  "variant",
  "size",
  "decorative",
  "ariaLabel",
  "id",
  "className",
  "dataAttributes",
] as const

function renderSpinnerSvgNode(spinnerSvgNode: SpinnerSvgNode, nodeIndex: number) {
  return h(spinnerSvgNode.tag, {
    key: `${spinnerSvgNode.tag}-${nodeIndex}`,
    ...spinnerSvgNode.attrs,
  })
}

export const Spinner = defineComponent(
  (props: SpinnerProps) => {
    const attrs = useAttrs()
    const ariaLabelFromAttrs =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined

    const renderKit = computed(() =>
      createSpinnerRecipe({
        ...(props.variant !== undefined ? { variant: props.variant } : {}),
        ...(props.size !== undefined ? { size: props.size } : {}),
        ...(props.decorative !== undefined ? { decorative: props.decorative } : {}),
        ...(props.id !== undefined ? { id: props.id } : {}),
        ...(props.ariaLabel !== undefined
          ? { ariaLabel: props.ariaLabel }
          : ariaLabelFromAttrs !== undefined
            ? { ariaLabel: ariaLabelFromAttrs }
            : {}),
      }),
    )

    return () => {
      const spinnerRenderKit = renderKit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, [
        "class",
        "style",
        "aria-label",
      ])

      return h(
        "span",
        {
          ...passthroughAttrs,
          ...spinnerRenderKit.dataAttributes,
          ...(props.dataAttributes ?? {}),
          class: mergeClassNames(spinnerRenderKit.className, props.className, attrs.class),
          style: mergeStyles(spinnerRenderKit.vars, attrs.style),
          role: spinnerRenderKit.a11y.role,
          id: spinnerRenderKit.a11y.id,
          "aria-hidden": spinnerRenderKit.a11y.ariaHidden ? "true" : undefined,
          "aria-label": spinnerRenderKit.a11y.ariaLabel,
          "aria-live": spinnerRenderKit.a11y.ariaLive,
        },
        [
          h(
            "svg",
            {
              class: "mw-spinner__svg",
              viewBox: spinnerRenderKit.svg.viewBox,
              "aria-hidden": "true",
              focusable: "false",
            },
            spinnerRenderKit.svg.nodes.map(renderSpinnerSvgNode),
          ),
        ],
      )
    }
  },
  {
    name: "MarwesSpinner",
    inheritAttrs: false,
    props: [...spinnerPropKeys],
  },
)
