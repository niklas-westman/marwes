import type { VNodeChild } from "vue"
import { defineComponent, h } from "vue"
import { CancelButton, ConfirmButton, DestructiveButton } from "../button"
import { DialogModal, type DialogModalProps } from "./dialog-modal"

export type ConfirmDialogProps = Omit<DialogModalProps, "footer"> & {
  confirmLabel?: VNodeChild
  cancelLabel?: VNodeChild
  onConfirm?: () => void
  onCancel?: () => void
}

export const ConfirmDialog = defineComponent({
  name: "MarwesConfirmDialog",
  inheritAttrs: false,
  props: [
    "confirmLabel",
    "cancelLabel",
    "onConfirm",
    "onCancel",
    "id",
    "title",
    "description",
    "size",
    "showFooter",
    "dismissible",
    "ariaLabel",
    "ariaLabelledBy",
    "ariaDescribedBy",
    "className",
    "dataAttributes",
    "open",
    "defaultOpen",
    "closeOnEscape",
    "closeOnScrimClick",
    "restoreFocus",
    "portalTarget",
    "overlayClassName",
  ],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as ConfirmDialogProps

    return () => {
      const { confirmLabel, cancelLabel, onConfirm, onCancel, ...dialogModalProps } = props

      return h(
        DialogModal,
        {
          ...attrs,
          ...dialogModalProps,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "confirm-dialog",
            "data-intent": "confirm",
          },
          footer: ({ close }: { close: () => void }) => [
            h(
              CancelButton,
              {
                onClick: () => {
                  onCancel?.()
                  close()
                },
              },
              { default: () => (cancelLabel !== undefined ? [cancelLabel] : ["Cancel"]) },
            ),
            h(
              ConfirmButton,
              {
                onClick: () => {
                  onConfirm?.()
                  close()
                },
              },
              { default: () => (confirmLabel !== undefined ? [confirmLabel] : ["Confirm"]) },
            ),
          ],
        },
        slots.default ? { default: slots.default } : undefined,
      )
    }
  },
})

export type DestructiveDialogProps = Omit<DialogModalProps, "footer"> & {
  confirmLabel?: VNodeChild
  cancelLabel?: VNodeChild
  onConfirm?: () => void
  onCancel?: () => void
}

export const DestructiveDialog = defineComponent({
  name: "MarwesDestructiveDialog",
  inheritAttrs: false,
  props: [
    "confirmLabel",
    "cancelLabel",
    "onConfirm",
    "onCancel",
    "id",
    "title",
    "description",
    "size",
    "showFooter",
    "dismissible",
    "ariaLabel",
    "ariaLabelledBy",
    "ariaDescribedBy",
    "className",
    "dataAttributes",
    "open",
    "defaultOpen",
    "closeOnEscape",
    "closeOnScrimClick",
    "restoreFocus",
    "portalTarget",
    "overlayClassName",
  ],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as DestructiveDialogProps

    return () => {
      const { confirmLabel, cancelLabel, onConfirm, onCancel, ...dialogModalProps } = props

      return h(
        DialogModal,
        {
          ...attrs,
          ...dialogModalProps,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "destructive-dialog",
            "data-intent": "destructive",
          },
          footer: ({ close }: { close: () => void }) => [
            h(
              CancelButton,
              {
                onClick: () => {
                  onCancel?.()
                  close()
                },
              },
              { default: () => (cancelLabel !== undefined ? [cancelLabel] : ["Cancel"]) },
            ),
            h(
              DestructiveButton,
              {
                onClick: () => {
                  onConfirm?.()
                  close()
                },
              },
              { default: () => (confirmLabel !== undefined ? [confirmLabel] : ["Delete"]) },
            ),
          ],
        },
        slots.default ? { default: slots.default } : undefined,
      )
    }
  },
})

export type InfoDialogProps = Omit<DialogModalProps, "footer"> & {
  acknowledgeLabel?: VNodeChild
  onAcknowledge?: () => void
}

export const InfoDialog = defineComponent({
  name: "MarwesInfoDialog",
  inheritAttrs: false,
  props: [
    "acknowledgeLabel",
    "onAcknowledge",
    "id",
    "title",
    "description",
    "size",
    "showFooter",
    "dismissible",
    "ariaLabel",
    "ariaLabelledBy",
    "ariaDescribedBy",
    "className",
    "dataAttributes",
    "open",
    "defaultOpen",
    "closeOnEscape",
    "closeOnScrimClick",
    "restoreFocus",
    "portalTarget",
    "overlayClassName",
  ],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as InfoDialogProps

    return () => {
      const { acknowledgeLabel, onAcknowledge, ...dialogModalProps } = props

      return h(
        DialogModal,
        {
          ...attrs,
          ...dialogModalProps,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "info-dialog",
            "data-intent": "info",
          },
          footer: ({ close }: { close: () => void }) =>
            h(
              ConfirmButton,
              {
                onClick: () => {
                  onAcknowledge?.()
                  close()
                },
              },
              { default: () => (acknowledgeLabel !== undefined ? [acknowledgeLabel] : ["Okay"]) },
            ),
        },
        slots.default ? { default: slots.default } : undefined,
      )
    }
  },
})
