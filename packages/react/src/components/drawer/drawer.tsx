import { type DrawerOptions, IconName, createDrawerRecipe } from "@marwes-ui/core"
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

export interface DrawerProps extends DrawerOptions {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
  className?: string
  panelClassName?: string
  dataAttributes?: Record<string, string>
}

export function Drawer(props: DrawerProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-drawer-${reactId}`
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const hasTitle = hasContent(props.title)
  const hasDescription = hasContent(props.description)
  const hasFooter = hasContent(props.footer) && (props.showFooter ?? true)
  const dismissible = (props.dismissible ?? true) && props.onClose !== undefined
  const drawerOptions: DrawerOptions = {
    showFooter: hasFooter,
    dismissible,
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
  } else if (props.ariaLabel === undefined && hasTitle) {
    drawerOptions.ariaLabelledBy = titleId
  }

  if (props.ariaDescribedBy) {
    drawerOptions.ariaDescribedBy = props.ariaDescribedBy
  } else if (hasDescription) {
    drawerOptions.ariaDescribedBy = descriptionId
  }

  const kit = createDrawerRecipe(drawerOptions)

  return (
    <div className={cx(kit.className, props.className)} style={kit.vars} {...kit.dataAttributes}>
      {kit.showScrim && (
        <div
          className={kit.scrim.className}
          style={kit.scrim.vars}
          aria-hidden="true"
          onClick={dismissible ? props.onClose : undefined}
          {...kit.scrim.dataAttributes}
        />
      )}

      <div
        id={id}
        className={cx(kit.panel.className, props.panelClassName)}
        style={kit.panel.vars}
        role={kit.panel.a11y.role}
        {...(kit.panel.a11y.ariaModal ? { "aria-modal": "true" } : {})}
        {...(kit.panel.a11y.ariaLabel ? { "aria-label": kit.panel.a11y.ariaLabel } : {})}
        {...(kit.panel.a11y.ariaLabelledBy
          ? { "aria-labelledby": kit.panel.a11y.ariaLabelledBy }
          : {})}
        {...(kit.panel.a11y.ariaDescribedBy
          ? { "aria-describedby": kit.panel.a11y.ariaDescribedBy }
          : {})}
        tabIndex={-1}
        {...kit.panel.dataAttributes}
      >
        {(hasTitle || kit.showCloseButton) && (
          <>
            <div className="mw-drawer__header">
              {hasTitle ? (
                <div className="mw-drawer__heading-group">
                  <h2 className="mw-drawer__title" id={titleId}>
                    {props.title}
                  </h2>
                </div>
              ) : (
                <span className="mw-drawer__spacer" aria-hidden="true" />
              )}

              {kit.showCloseButton && props.onClose && (
                <button
                  type="button"
                  className="mw-drawer__close"
                  aria-label="Close drawer"
                  onClick={props.onClose}
                >
                  <Icon name={IconName.X} decorative />
                </button>
              )}
            </div>
            <div className="mw-drawer__header-divider" aria-hidden="true" />
          </>
        )}

        <div className="mw-drawer__content">
          {hasDescription && (
            <p className="mw-drawer__description" id={descriptionId}>
              {props.description}
            </p>
          )}
          {props.children}
        </div>

        {hasFooter && (
          <>
            <div className="mw-drawer__footer-divider" aria-hidden="true" />
            <div className="mw-drawer__footer">{props.footer}</div>
          </>
        )}
      </div>
    </div>
  )
}
