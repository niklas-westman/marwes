import { type DialogOptions, IconName, createDialogRecipe } from "@marwes-ui/core"
import * as React from "react"
import { Icon } from "../icon"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

export interface DialogProps extends DialogOptions {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
  className?: string
  dataAttributes?: Record<string, string>
}

export function Dialog(props: DialogProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-dialog-${reactId}`
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const hasTitle = hasContent(props.title)
  const hasDescription = hasContent(props.description)
  const hasFooter = hasContent(props.footer) && (props.showFooter ?? true)
  const dismissible = (props.dismissible ?? true) && props.onClose !== undefined
  const dialogOptions: DialogOptions = {
    showFooter: hasFooter,
    dismissible,
    ...(props.modal !== undefined ? { modal: props.modal } : {}),
  }

  if (props.dataAttributes) {
    dialogOptions.dataAttributes = props.dataAttributes
  }

  if (props.size) {
    dialogOptions.size = props.size
  }

  if (props.ariaLabel) {
    dialogOptions.ariaLabel = props.ariaLabel
  }

  if (props.ariaLabelledBy) {
    dialogOptions.ariaLabelledBy = props.ariaLabelledBy
  } else if (props.ariaLabel === undefined && hasTitle) {
    dialogOptions.ariaLabelledBy = titleId
  }

  if (props.ariaDescribedBy) {
    dialogOptions.ariaDescribedBy = props.ariaDescribedBy
  } else if (hasDescription) {
    dialogOptions.ariaDescribedBy = descriptionId
  }

  const kit = createDialogRecipe(dialogOptions)

  return (
    <section
      id={id}
      className={cx(kit.className, props.className)}
      role={kit.a11y.role}
      {...(kit.a11y.ariaModal ? { "aria-modal": "true" } : {})}
      {...(kit.a11y.ariaLabel ? { "aria-label": kit.a11y.ariaLabel } : {})}
      {...(kit.a11y.ariaLabelledBy ? { "aria-labelledby": kit.a11y.ariaLabelledBy } : {})}
      {...(kit.a11y.ariaDescribedBy ? { "aria-describedby": kit.a11y.ariaDescribedBy } : {})}
      tabIndex={-1}
      {...kit.dataAttributes}
    >
      {(hasTitle || kit.showCloseButton) && (
        <>
          <header className="mw-dialog__header">
            {hasTitle ? (
              <div className="mw-dialog__heading-group">
                <h2 className="mw-dialog__title" id={titleId}>
                  {props.title}
                </h2>
              </div>
            ) : (
              <span className="mw-dialog__spacer" aria-hidden="true" />
            )}

            {kit.showCloseButton && props.onClose && (
              <button
                type="button"
                className="mw-dialog__close"
                aria-label="Close dialog"
                onClick={props.onClose}
              >
                <Icon name={IconName.X} decorative />
              </button>
            )}
          </header>
          <div className="mw-dialog__header-divider" aria-hidden="true" />
        </>
      )}

      <div className="mw-dialog__content">
        {hasDescription && (
          <p className="mw-dialog__description" id={descriptionId}>
            {props.description}
          </p>
        )}
        {props.children}
      </div>

      {hasFooter && (
        <>
          <div className="mw-dialog__footer-divider" aria-hidden="true" />
          <footer className="mw-dialog__footer">{props.footer}</footer>
        </>
      )}
    </section>
  )
}
