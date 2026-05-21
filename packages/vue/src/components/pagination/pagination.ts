import {
  IconName,
  clampPaginationPage,
  createPaginationControlRecipe,
  createPaginationEllipsisRecipe,
  createPaginationListItemRecipe,
  createPaginationListRecipe,
  createPaginationPageRecipe,
  createPaginationRecipe,
} from "@marwes-ui/core"
import { computed, defineComponent, h, ref, useAttrs, watch } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

export interface PaginationPropsVue {
  pageCount: number
  modelValue?: number
  defaultPage?: number
  siblingCount?: number
  boundaryCount?: number
  showPrevNext?: boolean
  disabled?: boolean
  previousLabel?: string
  nextLabel?: string
  ariaLabel?: string
  className?: string
  id?: string
}

const propKeys = [
  "pageCount",
  "modelValue",
  "defaultPage",
  "siblingCount",
  "boundaryCount",
  "showPrevNext",
  "disabled",
  "previousLabel",
  "nextLabel",
  "ariaLabel",
  "className",
  "id",
] as const

export const Pagination = defineComponent(
  (props: PaginationPropsVue, { emit }) => {
    const attrs = useAttrs()
    const isControlled = computed(() => props.modelValue !== undefined)
    const internalPage = ref(clampPaginationPage(props.defaultPage, props.pageCount))
    const resolvedPage = computed(() =>
      clampPaginationPage(
        isControlled.value ? props.modelValue : internalPage.value,
        props.pageCount,
      ),
    )

    watch(
      () => props.modelValue,
      (newPage) => {
        if (newPage !== undefined) {
          internalPage.value = clampPaginationPage(newPage, props.pageCount)
        }
      },
    )

    function selectPage(nextPage: number): void {
      if (props.disabled) return

      const resolved = clampPaginationPage(nextPage, props.pageCount)
      if (resolved === 0 || resolved === resolvedPage.value) return

      if (!isControlled.value) internalPage.value = resolved
      emit("update:modelValue", resolved)
      emit("page-change", resolved)
    }

    return () => {
      const previousLabel = props.previousLabel ?? "Previous"
      const nextLabel = props.nextLabel ?? "Next"
      const rootKit = createPaginationRecipe({
        page: resolvedPage.value,
        pageCount: props.pageCount,
        siblingCount: props.siblingCount,
        boundaryCount: props.boundaryCount,
        showPrevNext: props.showPrevNext,
        disabled: props.disabled,
        ariaLabel: props.ariaLabel,
        previousLabel,
        nextLabel,
      })
      const listKit = createPaginationListRecipe()
      const listItemKit = createPaginationListItemRecipe()
      const previousDisabled = props.disabled || resolvedPage.value <= 1
      const nextDisabled =
        props.disabled || resolvedPage.value <= 0 || resolvedPage.value >= props.pageCount
      const previousKit = createPaginationControlRecipe({
        direction: "previous",
        disabled: previousDisabled,
        label: previousLabel,
      })
      const nextKit = createPaginationControlRecipe({
        direction: "next",
        disabled: nextDisabled,
        label: nextLabel,
      })
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(rootKit.className, props.className, attrs.class)

      return h(
        "nav",
        {
          ...passthroughAttrs,
          id: props.id,
          class: className,
          "aria-label": rootKit.a11y.ariaLabel,
          "data-component": "pagination",
        },
        [
          rootKit.showPrevNext
            ? h(
                "button",
                {
                  type: "button",
                  class: previousKit.className,
                  "aria-label": previousKit.a11y.ariaLabel,
                  "aria-disabled": previousKit.a11y.ariaDisabled,
                  disabled: previousDisabled,
                  onClick: () => selectPage(resolvedPage.value - 1),
                },
                [
                  h("span", { class: "mw-pagination__control-icon" }, [
                    h(Icon, { name: IconName.ChevronLeft, decorative: true, size: 12 }),
                  ]),
                  previousLabel,
                ],
              )
            : null,
          h(
            "ul",
            {
              class: listKit.className,
              role: listKit.a11y.role,
            },
            rootKit.items.map((item) => {
              if (item.type === "ellipsis") {
                const ellipsisKit = createPaginationEllipsisRecipe()
                return h("li", { key: item.key, class: listItemKit.className }, [
                  h(
                    "span",
                    {
                      class: ellipsisKit.className,
                      "aria-hidden": ellipsisKit.a11y.ariaHidden,
                    },
                    "...",
                  ),
                ])
              }

              const pageKit = createPaginationPageRecipe({
                page: item.page,
                selected: item.selected,
                disabled: props.disabled,
              })

              return h("li", { key: item.key, class: listItemKit.className }, [
                h(
                  "button",
                  {
                    type: "button",
                    class: pageKit.className,
                    "aria-label": pageKit.a11y.ariaLabel,
                    "aria-current": pageKit.a11y.ariaCurrent,
                    "aria-disabled": pageKit.a11y.ariaDisabled,
                    disabled: props.disabled,
                    onClick: () => selectPage(item.page),
                  },
                  item.page,
                ),
              ])
            }),
          ),
          rootKit.showPrevNext
            ? h(
                "button",
                {
                  type: "button",
                  class: nextKit.className,
                  "aria-label": nextKit.a11y.ariaLabel,
                  "aria-disabled": nextKit.a11y.ariaDisabled,
                  disabled: nextDisabled,
                  onClick: () => selectPage(resolvedPage.value + 1),
                },
                [
                  nextLabel,
                  h("span", { class: "mw-pagination__control-icon" }, [
                    h(Icon, { name: IconName.ChevronRight, decorative: true, size: 12 }),
                  ]),
                ],
              )
            : null,
        ],
      )
    }
  },
  {
    name: "MarwesPagination",
    inheritAttrs: false,
    props: [...propKeys],
    emits: ["update:modelValue", "page-change"],
  },
)
