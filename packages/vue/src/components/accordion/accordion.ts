import { createAccordionRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export interface AccordionProps {
  id?: string
  open?: boolean
  disabled?: boolean
  className?: string
}

const accordionPropKeys = ["id", "open", "disabled", "className"] as const

export const Accordion = defineComponent(
  (props: AccordionProps, { slots, emit }) => {
    const attrs = useAttrs()
    const localId = createLocalId("mw-accordion")
    const resolvedId = computed(() => props.id ?? localId)

    const kit = computed(() => {
      const opts: import("@marwes-ui/core").AccordionOptions = { id: resolvedId.value }
      if (props.open !== undefined) opts.open = props.open
      if (props.disabled !== undefined) opts.disabled = props.disabled
      return createAccordionRecipe(opts)
    })

    function handleTriggerClick(): void {
      if (props.disabled) return
      emit("toggle")
    }

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)

      return h("div", { ...passthroughAttrs, class: className }, [
        h(
          "button",
          {
            id: a11y.triggerId,
            type: "button",
            class: "mw-accordion__trigger",
            "aria-expanded": a11y.ariaExpanded,
            "aria-controls": a11y.panelId,
            "aria-disabled": a11y.ariaDisabled,
            disabled: props.disabled,
            onClick: handleTriggerClick,
          },
          [
            h("span", { class: "mw-accordion__title" }, slots.title?.()),
            h("span", { class: "mw-accordion__icon", "aria-hidden": "true" }),
          ],
        ),
        h(
          "div",
          {
            id: a11y.panelId,
            role: "region",
            "aria-labelledby": a11y.triggerId,
            class: "mw-accordion__panel",
            hidden: !props.open,
          },
          [h("div", { class: "mw-accordion__content" }, slots.default?.())],
        ),
      ])
    }
  },
  {
    name: "MarwesAccordion",
    inheritAttrs: false,
    props: [...accordionPropKeys],
    emits: ["toggle"],
  },
)
