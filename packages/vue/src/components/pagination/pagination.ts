import {
  IconName,
  clampPaginationPage,
  createPaginationControlRecipe,
  createPaginationEllipsisRecipe,
  createPaginationListItemRecipe,
  createPaginationListRecipe,
  createPaginationPageRecipe,
  createPaginationRecipe,
  resolvePaginationAdaptiveProfile,
  resolvePaginationItemAriaLabel,
} from "@marwes-ui/core"
import type {
  IconName as IconNameType,
  PaginationAdaptiveProfile,
  PaginationControlDirection,
  PaginationControlDisplay,
  PaginationGetItemAriaLabel,
  PaginationResolvedControlDisplay,
} from "@marwes-ui/core"
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

export interface PaginationPropsVue {
  pageCount: number
  modelValue?: number
  defaultPage?: number
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
  controlDisplay?: PaginationControlDisplay
  adaptive?: boolean
  showPrevNext?: boolean
  showFirstLast?: boolean
  disabled?: boolean
  firstLabel?: string
  previousLabel?: string
  nextLabel?: string
  lastLabel?: string
  ariaLabel?: string
  getItemAriaLabel?: PaginationGetItemAriaLabel
  className?: string
  id?: string
}

const propKeys = [
  "pageCount",
  "modelValue",
  "defaultPage",
  "siblingCount",
  "boundaryCount",
  "maxVisibleItems",
  "controlDisplay",
  "adaptive",
  "showPrevNext",
  "showFirstLast",
  "disabled",
  "firstLabel",
  "previousLabel",
  "nextLabel",
  "lastLabel",
  "ariaLabel",
  "getItemAriaLabel",
  "className",
  "id",
] as const

function parsePxValue(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function resolveControlWidths(
  controls: HTMLElement[],
  itemSize: number,
): { labelControlWidth: number; iconControlWidth: number } {
  const labelControlWidth = controls.reduce((total, control) => {
    const icon = control.querySelector<HTMLElement>(".mw-pagination__control-icon")
    const label = control.querySelector<HTMLElement>(".mw-pagination__control-label")
    const iconWidth = icon?.getBoundingClientRect().width ?? 0
    const labelWidth = label?.scrollWidth ?? label?.getBoundingClientRect().width ?? 0
    const labelGap = iconWidth > 0 && labelWidth > 0 ? 4 : 0
    const measuredLabelWidth = iconWidth + labelGap + labelWidth

    return total + Math.max(control.getBoundingClientRect().width, measuredLabelWidth)
  }, 0)

  return {
    labelControlWidth,
    iconControlWidth: controls.length * itemSize,
  }
}

export const Pagination = defineComponent(
  (props: PaginationPropsVue, { emit }) => {
    const attrs = useAttrs()
    const isControlled = computed(() => props.modelValue !== undefined)
    const rootElement = ref<HTMLElement>()
    const adaptiveProfile = ref<PaginationAdaptiveProfile | undefined>(undefined)
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

    function measureAdaptiveProfile(): void {
      const root = rootElement.value
      const parent = root?.parentElement
      if (!root || !parent || props.adaptive === false || typeof window === "undefined") {
        adaptiveProfile.value = undefined
        return
      }

      const rootStyles = window.getComputedStyle(root)
      const parentStyles = window.getComputedStyle(parent)
      const itemSize = parsePxValue(rootStyles.getPropertyValue("--mw-pagination-size"), 32)
      const itemGap = parsePxValue(rootStyles.getPropertyValue("--mw-pagination-gap"), 2)
      const sectionGap = parsePxValue(
        rootStyles.getPropertyValue("--mw-pagination-section-gap"),
        12,
      )
      const parentWidth =
        parent.getBoundingClientRect().width -
        parsePxValue(parentStyles.paddingLeft, 0) -
        parsePxValue(parentStyles.paddingRight, 0)

      if (parentWidth <= 0) {
        adaptiveProfile.value = undefined
        return
      }

      const controls = Array.from(root.querySelectorAll<HTMLElement>(".mw-pagination__control"))
      const { labelControlWidth, iconControlWidth } = resolveControlWidths(controls, itemSize)
      adaptiveProfile.value = resolvePaginationAdaptiveProfile({
        containerWidth: parentWidth,
        labelControlWidth,
        iconControlWidth,
        controlCount: controls.length,
        itemSize,
        itemGap,
        sectionGap,
        pageCount: props.pageCount,
        ...(props.siblingCount !== undefined ? { siblingCount: props.siblingCount } : {}),
        ...(props.boundaryCount !== undefined ? { boundaryCount: props.boundaryCount } : {}),
        ...(props.maxVisibleItems !== undefined ? { maxVisibleItems: props.maxVisibleItems } : {}),
        controlDisplay: props.controlDisplay ?? "auto",
      })
    }

    let resizeObserver: ResizeObserver | undefined
    let frame = 0
    const requestMeasure = () => {
      if (typeof window === "undefined") return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measureAdaptiveProfile)
    }

    onMounted(() => {
      nextTick(requestMeasure)
      const root = rootElement.value
      const parent = root?.parentElement
      if (typeof window !== "undefined" && window.ResizeObserver && root && parent) {
        resizeObserver = new window.ResizeObserver(requestMeasure)
        resizeObserver.observe(parent)
        resizeObserver.observe(root)
      }
      if (typeof window !== "undefined") window.addEventListener("resize", requestMeasure)
    })

    onBeforeUnmount(() => {
      if (typeof window !== "undefined") {
        window.cancelAnimationFrame(frame)
        window.removeEventListener("resize", requestMeasure)
      }
      resizeObserver?.disconnect()
    })

    watch(
      () => [
        props.adaptive,
        props.boundaryCount,
        props.controlDisplay,
        props.maxVisibleItems,
        props.pageCount,
        props.siblingCount,
      ],
      requestMeasure,
    )

    return () => {
      const previousLabel = props.previousLabel ?? "Previous"
      const nextLabel = props.nextLabel ?? "Next"
      const firstLabel = props.firstLabel ?? "First"
      const lastLabel = props.lastLabel ?? "Last"
      const resolvedControlDisplay: PaginationResolvedControlDisplay =
        props.adaptive !== false && adaptiveProfile.value
          ? adaptiveProfile.value.controlDisplay
          : props.controlDisplay === "icon"
            ? "icon"
            : "label"
      const resolvedMaxVisibleItems =
        props.adaptive !== false && adaptiveProfile.value
          ? adaptiveProfile.value.maxVisibleItems
          : props.maxVisibleItems
      const rootKit = createPaginationRecipe({
        page: resolvedPage.value,
        pageCount: props.pageCount,
        ...(props.siblingCount !== undefined ? { siblingCount: props.siblingCount } : {}),
        ...(props.boundaryCount !== undefined ? { boundaryCount: props.boundaryCount } : {}),
        ...(resolvedMaxVisibleItems !== undefined
          ? { maxVisibleItems: resolvedMaxVisibleItems }
          : {}),
        controlDisplay: resolvedControlDisplay,
        ...(props.showPrevNext !== undefined ? { showPrevNext: props.showPrevNext } : {}),
        ...(props.showFirstLast !== undefined ? { showFirstLast: props.showFirstLast } : {}),
        ...(props.disabled !== undefined ? { disabled: props.disabled } : {}),
        ...(props.ariaLabel !== undefined ? { ariaLabel: props.ariaLabel } : {}),
        firstLabel,
        previousLabel,
        nextLabel,
        lastLabel,
        ...(props.getItemAriaLabel !== undefined
          ? { getItemAriaLabel: props.getItemAriaLabel }
          : {}),
      })
      const listKit = createPaginationListRecipe()
      const listItemKit = createPaginationListItemRecipe()
      const previousDisabled = props.disabled || resolvedPage.value <= 1
      const nextDisabled =
        props.disabled || resolvedPage.value <= 0 || resolvedPage.value >= props.pageCount
      const firstDisabled = props.disabled || resolvedPage.value <= 1
      const lastDisabled =
        props.disabled || resolvedPage.value <= 0 || resolvedPage.value >= props.pageCount
      const firstKit = createPaginationControlRecipe({
        direction: "first",
        disabled: firstDisabled,
        label: firstLabel,
        ...(props.getItemAriaLabel !== undefined
          ? {
              ariaLabel: resolvePaginationItemAriaLabel(props.getItemAriaLabel, {
                type: "first",
                page: 1,
                selected: false,
              }),
            }
          : {}),
      })
      const previousKit = createPaginationControlRecipe({
        direction: "previous",
        disabled: previousDisabled,
        label: previousLabel,
        ...(props.getItemAriaLabel !== undefined
          ? {
              ariaLabel: resolvePaginationItemAriaLabel(props.getItemAriaLabel, {
                type: "previous",
                page: resolvedPage.value - 1,
                selected: false,
              }),
            }
          : {}),
      })
      const nextKit = createPaginationControlRecipe({
        direction: "next",
        disabled: nextDisabled,
        label: nextLabel,
        ...(props.getItemAriaLabel !== undefined
          ? {
              ariaLabel: resolvePaginationItemAriaLabel(props.getItemAriaLabel, {
                type: "next",
                page: resolvedPage.value + 1,
                selected: false,
              }),
            }
          : {}),
      })
      const lastKit = createPaginationControlRecipe({
        direction: "last",
        disabled: lastDisabled,
        label: lastLabel,
        ...(props.getItemAriaLabel !== undefined
          ? {
              ariaLabel: resolvePaginationItemAriaLabel(props.getItemAriaLabel, {
                type: "last",
                page: props.pageCount,
                selected: false,
              }),
            }
          : {}),
      })
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(rootKit.className, props.className, attrs.class)
      const renderControl = (
        direction: PaginationControlDirection,
        kit: typeof firstKit | typeof previousKit | typeof nextKit | typeof lastKit,
        controlDisabled: boolean,
        targetPage: number,
        label: string,
        iconName: IconNameType,
      ) => {
        const isLeadingIcon = direction === "first" || direction === "previous"
        const icon = h("span", { class: "mw-pagination__control-icon" }, [
          h(Icon, { name: iconName, decorative: true, size: 12 }),
        ])

        return h(
          "button",
          {
            type: "button",
            class: kit.className,
            "aria-label": kit.a11y.ariaLabel,
            "aria-disabled": kit.a11y.ariaDisabled,
            disabled: controlDisabled,
            onClick: () => selectPage(targetPage),
          },
          [
            isLeadingIcon ? icon : null,
            h("span", { class: "mw-pagination__control-label" }, label),
            isLeadingIcon ? null : icon,
          ],
        )
      }

      return h(
        "nav",
        {
          ...passthroughAttrs,
          id: props.id,
          ref: rootElement,
          class: className,
          style: [rootKit.vars, attrs.style],
          "aria-label": rootKit.a11y.ariaLabel,
          "data-component": "pagination",
          "data-control-display": rootKit.controlDisplay,
        },
        [
          rootKit.showFirstLast
            ? renderControl("first", firstKit, firstDisabled, 1, firstLabel, IconName.ChevronsLeft)
            : null,
          rootKit.showPrevNext
            ? renderControl(
                "previous",
                previousKit,
                previousDisabled,
                resolvedPage.value - 1,
                previousLabel,
                IconName.ChevronLeft,
              )
            : null,
          h(
            "ul",
            {
              class: listKit.className,
              role: listKit.a11y.role,
            },
            rootKit.items.map((item) => {
              if (item.type !== "page") {
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
                ...(props.disabled !== undefined ? { disabled: props.disabled } : {}),
                ...(props.getItemAriaLabel !== undefined
                  ? {
                      ariaLabel: resolvePaginationItemAriaLabel(props.getItemAriaLabel, {
                        type: "page",
                        page: item.page,
                        selected: item.selected,
                      }),
                    }
                  : {}),
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
            ? renderControl(
                "next",
                nextKit,
                nextDisabled,
                resolvedPage.value + 1,
                nextLabel,
                IconName.ChevronRight,
              )
            : null,
          rootKit.showFirstLast
            ? renderControl(
                "last",
                lastKit,
                lastDisabled,
                props.pageCount,
                lastLabel,
                IconName.ChevronsRight,
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
