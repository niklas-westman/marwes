import { type CssVars, type SkeletonOptions, createSkeletonRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SkeletonProps = SkeletonOptions & {
  className?: string
  dataAttributes?: Record<string, string>
}

const skeletonPropKeys = [
  "variant",
  "width",
  "height",
  "radius",
  "animation",
  "decorative",
  "ariaLabel",
  "id",
  "className",
  "dataAttributes",
] as const

export const Skeleton = defineComponent(
  (props: SkeletonProps) => {
    const attrs = useAttrs()
    const ariaLabelFromAttrs =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined

    const renderKit = computed(() =>
      createSkeletonRecipe({
        ...(props.variant !== undefined ? { variant: props.variant } : {}),
        ...(props.width !== undefined ? { width: props.width } : {}),
        ...(props.height !== undefined ? { height: props.height } : {}),
        ...(props.radius !== undefined ? { radius: props.radius } : {}),
        ...(props.animation !== undefined ? { animation: props.animation } : {}),
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
      const skeletonRenderKit = renderKit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, [
        "class",
        "style",
        "aria-label",
      ])

      return h("span", {
        ...passthroughAttrs,
        ...skeletonRenderKit.dataAttributes,
        ...(props.dataAttributes ?? {}),
        class: mergeClassNames(skeletonRenderKit.className, props.className, attrs.class),
        style: mergeStyles(skeletonRenderKit.vars as CssVars, attrs.style),
        role: skeletonRenderKit.a11y.role,
        id: skeletonRenderKit.a11y.id,
        "aria-hidden": skeletonRenderKit.a11y.ariaHidden ? "true" : undefined,
        "aria-label": skeletonRenderKit.a11y.ariaLabel,
        "aria-live": skeletonRenderKit.a11y.ariaLive,
      })
    }
  },
  {
    name: "MarwesSkeleton",
    inheritAttrs: false,
    props: [...skeletonPropKeys],
  },
)
