import type * as React from "react"
import { CancelButton, ConfirmButton, DestructiveButton } from "../button"
import { DialogModal, type DialogModalProps } from "./dialog-modal"

export type ConfirmDialogProps = Omit<DialogModalProps, "footer"> & {
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
}

export function ConfirmDialog(props: ConfirmDialogProps): React.ReactElement {
  const {
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    dataAttributes,
    ...dialogProps
  } = props

  return (
    <DialogModal
      {...dialogProps}
      dataAttributes={{
        ...dataAttributes,
        "data-purpose": "confirm-dialog",
        "data-intent": "confirm",
      }}
      footer={({ close }) => (
        <>
          <CancelButton
            onClick={() => {
              onCancel?.()
              close()
            }}
          >
            {cancelLabel}
          </CancelButton>
          <ConfirmButton
            onClick={() => {
              onConfirm?.()
              close()
            }}
          >
            {confirmLabel}
          </ConfirmButton>
        </>
      )}
    />
  )
}

export type DestructiveDialogProps = Omit<DialogModalProps, "footer"> & {
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
}

export function DestructiveDialog(props: DestructiveDialogProps): React.ReactElement {
  const {
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    dataAttributes,
    ...dialogProps
  } = props

  return (
    <DialogModal
      {...dialogProps}
      dataAttributes={{
        ...dataAttributes,
        "data-purpose": "destructive-dialog",
        "data-intent": "destructive",
      }}
      footer={({ close }) => (
        <>
          <CancelButton
            onClick={() => {
              onCancel?.()
              close()
            }}
          >
            {cancelLabel}
          </CancelButton>
          <DestructiveButton
            onClick={() => {
              onConfirm?.()
              close()
            }}
          >
            {confirmLabel}
          </DestructiveButton>
        </>
      )}
    />
  )
}

export type InfoDialogProps = Omit<DialogModalProps, "footer"> & {
  acknowledgeLabel?: React.ReactNode
  onAcknowledge?: () => void
}

export function InfoDialog(props: InfoDialogProps): React.ReactElement {
  const { acknowledgeLabel = "Okay", onAcknowledge, dataAttributes, ...dialogProps } = props

  return (
    <DialogModal
      {...dialogProps}
      dataAttributes={{
        ...dataAttributes,
        "data-purpose": "info-dialog",
        "data-intent": "info",
      }}
      footer={({ close }) => (
        <ConfirmButton
          onClick={() => {
            onAcknowledge?.()
            close()
          }}
        >
          {acknowledgeLabel}
        </ConfirmButton>
      )}
    />
  )
}
