import { IconName, type IconNameType } from "@marwes-ui/core"
import type { VNodeChild } from "vue"
import { computed, defineComponent, h, ref, useAttrs, watch } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"
import { Tooltip } from "./tooltip"

const TOOLTIP_EXIT_DURATION_MS = 160

function toChildren(value: VNodeChild | undefined): VNodeChild[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value === undefined || value === null || value === false) {
    return []
  }

  return [value]
}

export type TooltipGroupProps = {
  id?: string
  content?: VNodeChild
  icon?: IconNameType
  triggerLabel?: string
  open?: boolean
  defaultOpen?: boolean
  tooltipId?: string
  className?: string
  tooltipClassName?: string
  triggerClassName?: string
  dataAttributes?: Record<string, string>
  onOpenChange?: (open: boolean) => void
}

const tooltipGroupPropKeys = [
  "id",
  "content",
  "icon",
  "triggerLabel",
  "open",
  "defaultOpen",
  "tooltipId",
  "className",
  "tooltipClassName",
  "triggerClassName",
  "dataAttributes",
  "onOpenChange",
] as const

export const TooltipGroup = defineComponent(
  (props: TooltipGroupProps, { attrs, slots, emit }) => {
    const localId = createLocalId("mw-tooltip-group")
    const internalOpen = ref(props.defaultOpen ?? false)
    const isControlled = computed(() => props.open !== undefined)
    const resolvedOpen = computed(
      () => (isControlled.value ? props.open : internalOpen.value) ?? false,
    )
    const isTooltipMounted = ref(resolvedOpen.value)
    const resolvedId = computed(() => props.id ?? localId)
    const resolvedTooltipId = computed(() => props.tooltipId ?? `${resolvedId.value}-tooltip`)
    const content = computed<VNodeChild | undefined>(() => slots.default?.() ?? props.content)

    const updateOpen = (nextOpen: boolean): void => {
      if (resolvedOpen.value === nextOpen) {
        return
      }

      if (!isControlled.value) {
        internalOpen.value = nextOpen
      }

      props.onOpenChange?.(nextOpen)
      emit("update:open", nextOpen)
      emit("open-change", nextOpen)
    }

    watch(resolvedOpen, (nextOpen, _previousOpen, onCleanup) => {
      if (nextOpen) {
        isTooltipMounted.value = true
        return
      }

      const timeoutId = window.setTimeout(() => {
        isTooltipMounted.value = false
      }, TOOLTIP_EXIT_DURATION_MS)

      onCleanup(() => {
        window.clearTimeout(timeoutId)
      })
    })

    return () => {
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames("mw-tooltip-group", props.className, attrs.class)

      return h(
        "span",
        {
          ...passthroughAttrs,
          ...(props.dataAttributes ?? {}),
          id: props.id,
          class: className,
          style: attrs.style,
          "data-component": "tooltip-group",
          "data-open": resolvedOpen.value ? "true" : undefined,
          onMouseenter: () => updateOpen(true),
          onMouseleave: () => updateOpen(false),
          onFocusin: () => updateOpen(true),
          onFocusout: (event: FocusEvent) => {
            const nextFocusedElement = event.relatedTarget
            const currentTarget = event.currentTarget

            if (
              nextFocusedElement instanceof Node &&
              currentTarget instanceof HTMLElement &&
              currentTarget.contains(nextFocusedElement)
            ) {
              return
            }

            updateOpen(false)
          },
          onKeydown: (event: KeyboardEvent) => {
            if (event.key === "Escape") {
              updateOpen(false)
            }
          },
        },
        [
          isTooltipMounted.value
            ? h(
                Tooltip,
                {
                  id: resolvedTooltipId.value,
                  ...(props.tooltipClassName ? { className: props.tooltipClassName } : {}),
                  "data-state": resolvedOpen.value ? "open" : "closed",
                  "aria-hidden": resolvedOpen.value ? undefined : "true",
                },
                {
                  default: () => toChildren(content.value),
                },
              )
            : null,
          h(
            "button",
            {
              type: "button",
              class: mergeClassNames("mw-tooltip-group__trigger", props.triggerClassName),
              "aria-label": props.triggerLabel ?? "Show tooltip",
              "aria-describedby": resolvedOpen.value ? resolvedTooltipId.value : undefined,
            },
            [h(Icon, { name: props.icon ?? IconName.HelpCircle, decorative: true })],
          ),
        ],
      )
    }
  },
  {
    name: "MarwesTooltipGroup",
    inheritAttrs: false,
    props: [...tooltipGroupPropKeys],
    emits: ["update:open", "open-change"],
  },
)
