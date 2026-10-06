import {
  IconName,
  createBannerRecipe,
  toBannerDismissHtmlAttributes,
  toBannerHtmlAttributes,
} from "@marwes-ui/core"
import type { BannerOptions } from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"
import { Icon } from "../icon"

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
  /** Extra data attributes for the root, e.g. purpose semantics from variant wrappers. */
  dataAttributes?: Record<string, string | boolean | undefined>
}

export function Banner(props: BannerProps): React.ReactElement {
  const { children, action, icon, onDismiss, className, id, dataAttributes, ...coreProps } = props
  const kit = createBannerRecipe({
    ...coreProps,
    showAction: coreProps.showAction ?? Boolean(action),
  })

  return (
    <div
      id={id}
      className={[kit.root.className, className].filter(Boolean).join(" ")}
      {...toReactAttributes(toBannerHtmlAttributes(kit.root.a11y))}
      {...kit.root.dataAttributes}
      {...dataAttributes}
    >
      <div className={kit.content.className}>
        {kit.icon.visible && (
          <span className={kit.icon.className}>
            {icon ?? <Icon name={IconName.Info} decorative />}
          </span>
        )}
        <span className={kit.message.className}>{children}</span>
      </div>
      {kit.action.visible && action && <div className={kit.action.className}>{action}</div>}
      {kit.dismiss.visible && (
        <button
          type="button"
          className={kit.dismiss.className}
          {...toReactAttributes(toBannerDismissHtmlAttributes(kit.dismiss.a11y))}
          onClick={onDismiss}
        />
      )}
    </div>
  )
}
