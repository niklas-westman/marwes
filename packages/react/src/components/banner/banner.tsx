import { createBannerRecipe } from "@marwes-ui/core"
import type { BannerOptions } from "@marwes-ui/core"
import type * as React from "react"

export type BannerProps = BannerOptions & {
  /** Banner message content. */
  children?: React.ReactNode
  /** Optional CTA/action content rendered in the action slot. */
  action?: React.ReactNode
  /** Custom icon element. If omitted, a default status icon is rendered when showIcon is true. */
  icon?: React.ReactNode
  /** Callback when the dismiss button is clicked. */
  onDismiss?: () => void
  className?: string
  id?: string
}

export function Banner(props: BannerProps): React.ReactElement {
  const { children, action, icon, onDismiss, className, id, ...coreProps } = props
  const kit = createBannerRecipe({
    ...coreProps,
    showAction: coreProps.showAction ?? Boolean(action),
  })

  return (
    <div
      id={id}
      className={[kit.root.className, className].filter(Boolean).join(" ")}
      role={kit.root.a11y.role}
      aria-label={kit.root.a11y.ariaLabel}
      aria-live={kit.root.a11y.ariaLive}
      {...kit.root.dataAttributes}
    >
      <div className={kit.content.className}>
        {kit.icon.visible && (
          <span className={kit.icon.className}>
            {icon ?? <DefaultBannerIcon variant={props.variant} />}
          </span>
        )}
        <span className={kit.message.className}>{children}</span>
      </div>
      {kit.action.visible && action && <div className={kit.action.className}>{action}</div>}
      {kit.dismiss.visible && (
        <button
          type="button"
          className={kit.dismiss.className}
          aria-label={kit.dismiss.ariaLabel}
          onClick={onDismiss}
        />
      )}
    </div>
  )
}

/** Default info-circle icon for the banner. Adapts color via CSS. */
function DefaultBannerIcon({
  variant: _variant,
}: { variant?: string | undefined }): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}
