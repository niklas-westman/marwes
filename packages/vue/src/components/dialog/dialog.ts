import { type DialogOptions, IconName, createDialogRecipe } from "@marwes-ui/core"
import type { VNodeChild } from "vue"
import { computed, defineComponent, h, useAttrs } from "vue"
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

export type DialogProps = DialogOptions & {
  id?: string
  title?: VNodeChild
  description?: VNodeChild
  footer?: VNodeChild
  onClose?: () => void
  className?: string
  dataAttributes?: Record<string, string>
}

const dialogPropKeys = [
  "id",
  "title",
  "description",
  "footer",
  "size",
  "showFooter",
  "dismissible",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "onClose",
  "className",
  "dataAttributes",
] as const

export const Dialog = defineComponent(
  (props: DialogProps, { attrs, slots }) => {
    const localId = createLocalId("mw-dialog")
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
    const kit = computed(() => {
      const dialogOptions: DialogOptions = {
        showFooter: hasFooter.value,
        dismissible: dismissible.value,
      }

      if (props.size) {
        dialogOptions.size = props.size
      }

      if (props.ariaLabel) {
        dialogOptions.ariaLabel = props.ariaLabel
      }

      if (props.ariaLabelledBy) {
        dialogOptions.ariaLabelledBy = props.ariaLabelledBy
      } else if (props.ariaLabel === undefined && hasTitle.value) {
        dialogOptions.ariaLabelledBy = titleId.value
      }

      if (props.ariaDescribedBy) {
        dialogOptions.ariaDescribedBy = props.ariaDescribedBy
      } else if (hasDescription.value) {
        dialogOptions.ariaDescribedBy = descriptionId.value
      }

      return createDialogRecipe(dialogOptions)
    })

    return () =>
      h(
        "section",
        {
          ...attrsWithoutClass.value,
          ...(props.dataAttributes ?? {}),
          id: id.value,
          class: mergeClassNames(kit.value.className, props.className, attrs.class),
          role: kit.value.a11y.role,
          "aria-modal": "true",
          "aria-label": kit.value.a11y.ariaLabel,
          "aria-labelledby": kit.value.a11y.ariaLabelledBy,
          "aria-describedby": kit.value.a11y.ariaDescribedBy,
          tabindex: -1,
        },
        [
          hasTitle.value || kit.value.showCloseButton
            ? [
                h("header", { class: "mw-dialog__header" }, [
                  hasTitle.value
                    ? h("div", { class: "mw-dialog__heading-group" }, [
                        h(
                          "h2",
                          { class: "mw-dialog__title", id: titleId.value },
                          toChildren(titleContent.value),
                        ),
                      ])
                    : h("span", { class: "mw-dialog__spacer", "aria-hidden": "true" }),
                  kit.value.showCloseButton && props.onClose
                    ? h(
                        "button",
                        {
                          type: "button",
                          class: "mw-dialog__close",
                          "aria-label": "Close dialog",
                          onClick: () => props.onClose?.(),
                        },
                        [h(Icon, { name: IconName.X, decorative: true })],
                      )
                    : null,
                ]),
                h("div", { class: "mw-dialog__header-divider", "aria-hidden": "true" }),
              ]
            : null,
          h("div", { class: "mw-dialog__content" }, [
            hasDescription.value
              ? h(
                  "p",
                  { class: "mw-dialog__description", id: descriptionId.value },
                  toChildren(descriptionContent.value),
                )
              : null,
            ...(slots.default?.() ?? []),
          ]),
          hasFooter.value
            ? [
                h("div", { class: "mw-dialog__footer-divider", "aria-hidden": "true" }),
                h("footer", { class: "mw-dialog__footer" }, toChildren(footerContent.value)),
              ]
            : null,
        ],
      )
  },
  {
    name: "MarwesDialog",
    inheritAttrs: false,
    props: [...dialogPropKeys],
  },
)
