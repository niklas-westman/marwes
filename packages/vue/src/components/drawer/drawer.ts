import { type DrawerOptions, IconName, createDrawerRecipe } from "@marwes-ui/core"
import type { VNodeChild } from "vue"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

function hasContent(value: VNodeChild | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

function toChildren(value: VNodeChild | undefined): VNodeChild[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value === undefined || value === null || value === false) {
    return []
  }

  return [value]
}

export type DrawerProps = DrawerOptions & {
  id?: string
  title?: VNodeChild
  description?: VNodeChild
  footer?: VNodeChild
  onClose?: () => void
  className?: string
  panelClassName?: string
  dataAttributes?: Record<string, string>
}

const drawerPropKeys = [
  "id",
  "title",
  "description",
  "footer",
  "size",
  "placement",
  "showFooter",
  "dismissible",
  "modal",
  "showScrim",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "onClose",
  "className",
  "panelClassName",
  "dataAttributes",
] as const

export const Drawer = defineComponent(
  (props: DrawerProps, { attrs, emit, slots }) => {
    const localId = createLocalId("mw-drawer")
    const id = computed(() => props.id ?? localId)
    const titleId = computed(() => `${id.value}-title`)
    const descriptionId = computed(() => `${id.value}-description`)
    const titleContent = computed<VNodeChild | undefined>(() => slots.title?.() ?? props.title)
    const descriptionContent = computed<VNodeChild | undefined>(
      () => slots.description?.() ?? props.description,
    )
    const footerContent = computed<VNodeChild | undefined>(() => slots.footer?.() ?? props.footer)
    const hasTitle = computed(() => hasContent(titleContent.value))
    const hasDescription = computed(() => hasContent(descriptionContent.value))
    const hasFooter = computed(() => hasContent(footerContent.value) && (props.showFooter ?? true))
    const dismissible = computed(() => (props.dismissible ?? true) && props.onClose !== undefined)
    const attrsWithoutClass = computed(() =>
      omitAttrs(attrs as Record<string, unknown>, ["class", "style"]),
    )
    const close = () => {
      emit("close")
    }
    const kit = computed(() => {
      const drawerOptions: DrawerOptions = {
        showFooter: hasFooter.value,
        dismissible: dismissible.value,
        ...(props.modal !== undefined ? { modal: props.modal } : {}),
        ...(props.showScrim !== undefined ? { showScrim: props.showScrim } : {}),
      }

      if (props.dataAttributes) {
        drawerOptions.dataAttributes = props.dataAttributes
      }

      if (props.size) {
        drawerOptions.size = props.size
      }

      if (props.placement) {
        drawerOptions.placement = props.placement
      }

      if (props.ariaLabel) {
        drawerOptions.ariaLabel = props.ariaLabel
      }

      if (props.ariaLabelledBy) {
        drawerOptions.ariaLabelledBy = props.ariaLabelledBy
      } else if (props.ariaLabel === undefined && hasTitle.value) {
        drawerOptions.ariaLabelledBy = titleId.value
      }

      if (props.ariaDescribedBy) {
        drawerOptions.ariaDescribedBy = props.ariaDescribedBy
      } else if (hasDescription.value) {
        drawerOptions.ariaDescribedBy = descriptionId.value
      }

      return createDrawerRecipe(drawerOptions)
    })

    return () =>
      h(
        "div",
        {
          ...attrsWithoutClass.value,
          ...kit.value.dataAttributes,
          class: mergeClassNames(kit.value.className, props.className, attrs.class),
        },
        [
          kit.value.showScrim
            ? h("div", {
                ...kit.value.scrim.dataAttributes,
                class: kit.value.scrim.className,
                style: kit.value.scrim.vars,
                "aria-hidden": "true",
                onClick: dismissible.value ? close : undefined,
              })
            : null,
          h(
            "aside",
            {
              ...kit.value.panel.dataAttributes,
              id: id.value,
              class: mergeClassNames(kit.value.panel.className, props.panelClassName),
              style: kit.value.panel.vars,
              role: kit.value.panel.a11y.role,
              "aria-modal": kit.value.panel.a11y.ariaModal ? "true" : undefined,
              "aria-label": kit.value.panel.a11y.ariaLabel,
              "aria-labelledby": kit.value.panel.a11y.ariaLabelledBy,
              "aria-describedby": kit.value.panel.a11y.ariaDescribedBy,
              tabindex: -1,
            },
            [
              hasTitle.value || kit.value.showCloseButton
                ? [
                    h("header", { class: "mw-drawer__header" }, [
                      hasTitle.value
                        ? h("div", { class: "mw-drawer__heading-group" }, [
                            h(
                              "h2",
                              { class: "mw-drawer__title", id: titleId.value },
                              toChildren(titleContent.value),
                            ),
                          ])
                        : h("span", { class: "mw-drawer__spacer", "aria-hidden": "true" }),
                      kit.value.showCloseButton && props.onClose
                        ? h(
                            "button",
                            {
                              type: "button",
                              class: "mw-drawer__close",
                              "aria-label": "Close drawer",
                              onClick: close,
                            },
                            [h(Icon, { name: IconName.X, decorative: true })],
                          )
                        : null,
                    ]),
                    h("div", { class: "mw-drawer__header-divider", "aria-hidden": "true" }),
                  ]
                : null,
              h("div", { class: "mw-drawer__content" }, [
                hasDescription.value
                  ? h(
                      "p",
                      { class: "mw-drawer__description", id: descriptionId.value },
                      toChildren(descriptionContent.value),
                    )
                  : null,
                ...(slots.default?.() ?? []),
              ]),
              hasFooter.value
                ? [
                    h("div", { class: "mw-drawer__footer-divider", "aria-hidden": "true" }),
                    h("footer", { class: "mw-drawer__footer" }, toChildren(footerContent.value)),
                  ]
                : null,
            ],
          ),
        ],
      )
  },
  {
    name: "MarwesDrawer",
    inheritAttrs: false,
    props: [...drawerPropKeys],
    emits: ["close"],
  },
)
