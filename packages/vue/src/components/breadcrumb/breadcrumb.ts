import {
  IconName,
  createBreadcrumbRecipe,
  toBreadcrumbHomeHtmlAttributes,
  toBreadcrumbHtmlAttributes,
  toBreadcrumbItemHtmlAttributes,
  toBreadcrumbListHtmlAttributes,
  toBreadcrumbSeparatorHtmlAttributes,
} from "@marwes-ui/core"
import type { BreadcrumbItem, BreadcrumbOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

export type BreadcrumbProps = BreadcrumbOptions & {
  items: readonly BreadcrumbItem[]
  className?: string
}

const breadcrumbPropKeys = [
  "items",
  "ariaLabel",
  "showHome",
  "homeHref",
  "homeLabel",
  "dataAttributes",
  "className",
] as const

export const Breadcrumb = defineComponent(
  (props: BreadcrumbProps, { emit }) => {
    const attrs = useAttrs()
    const kit = computed(() =>
      createBreadcrumbRecipe({
        items: props.items,
        ...(props.ariaLabel !== undefined ? { ariaLabel: props.ariaLabel } : {}),
        ...(props.showHome !== undefined ? { showHome: props.showHome } : {}),
        ...(props.homeHref !== undefined ? { homeHref: props.homeHref } : {}),
        ...(props.homeLabel !== undefined ? { homeLabel: props.homeLabel } : {}),
        ...(props.dataAttributes !== undefined ? { dataAttributes: props.dataAttributes } : {}),
      }),
    )

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])

      return h(
        "nav",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          class: mergeClassNames(renderKit.className, props.className, attrs.class),
          ...toBreadcrumbHtmlAttributes(renderKit.a11y),
        },
        h(
          "ol",
          {
            class: renderKit.list.className,
            ...toBreadcrumbListHtmlAttributes(renderKit.list.a11y),
          },
          renderKit.items.map((item, index) =>
            h(
              "li",
              {
                key: item.key,
                ...item.dataAttributes,
                class: item.className,
              },
              [
                index > 0
                  ? h(
                      "span",
                      {
                        class: renderKit.separator.className,
                        ...toBreadcrumbSeparatorHtmlAttributes(renderKit.separator.a11y),
                      },
                      h(Icon, { name: IconName.ChevronRight, decorative: true, size: 12 }),
                    )
                  : null,
                item.kind === "home"
                  ? renderHomeItem(item, () => emit("home-click"))
                  : renderActionItem(item, (value, sourceItem) =>
                      emit("item-select", value, sourceItem),
                    ),
              ],
            ),
          ),
        ),
      )
    }
  },
  {
    name: "MarwesBreadcrumb",
    inheritAttrs: false,
    props: [...breadcrumbPropKeys],
    emits: ["item-select", "home-click"],
  },
)

type BreadcrumbRenderItem = ReturnType<typeof createBreadcrumbRecipe>["items"][number]

function renderHomeItem(
  item: Extract<BreadcrumbRenderItem, { kind: "home" }>,
  onHomeClick: () => void,
) {
  const commonProps = {
    class: item.actionClassName,
    ...toBreadcrumbHomeHtmlAttributes(item.a11y),
  }
  const icon = h(Icon, { name: IconName.Home, decorative: true, size: 14 })

  if (item.href) {
    return h("a", { ...commonProps, href: item.href, onClick: onHomeClick }, icon)
  }

  if (!item.current) {
    return h("button", { ...commonProps, type: "button", onClick: onHomeClick }, icon)
  }

  return h("span", commonProps, icon)
}

function renderActionItem(
  item: Extract<BreadcrumbRenderItem, { kind: "item" }>,
  onSelect: (value: string, item: BreadcrumbItem) => void,
) {
  const sourceItem = item.item ?? {
    label: item.label,
    ...(item.value ? { value: item.value } : {}),
    ...(item.href ? { href: item.href } : {}),
    current: item.current,
  }
  const commonProps = {
    class: item.actionClassName,
    ...toBreadcrumbItemHtmlAttributes(item.a11y),
  }

  if (item.current) {
    return h("span", commonProps, item.label)
  }

  if (item.href) {
    return h(
      "a",
      {
        ...commonProps,
        href: item.href,
        onClick: () => onSelect(item.value ?? item.label, sourceItem),
      },
      item.label,
    )
  }

  return h(
    "button",
    {
      ...commonProps,
      type: "button",
      onClick: () => onSelect(item.value ?? item.label, sourceItem),
    },
    item.label,
  )
}
