import { type SkipLinkOptions, createSkipLinkRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"

export type SkipLinkProps = Omit<SkipLinkOptions, "className"> & {
  className?: string
}

const skipLinkPropKeys = ["href", "className"] as const

export const SkipLink = defineComponent(
  (props: SkipLinkProps, { slots }) => {
    const kit = computed(() =>
      createSkipLinkRecipe({
        href: props.href,
        ...(props.className !== undefined ? { className: props.className } : {}),
      }),
    )

    return () =>
      h(
        "a",
        {
          href: props.href,
          class: kit.value.className,
        },
        slots.default?.(),
      )
  },
  {
    name: "MarwesSkipLink",
    props: [...skipLinkPropKeys],
  },
)
