/**
 * BadgeGroup (Molecule) — Recommended
 *
 * An accessible badge group with a visible label. Groups related badges
 * into a `role="group"` container with `aria-labelledby` wiring.
 *
 * Use `BadgeGroup` when displaying multiple related badges together
 * (e.g. a list of tags, status indicators, or categories).
 * Use `Badge` directly only when a single standalone badge is needed.
 *
 * @example
 * ```tsx
 * import { BadgeVariant } from "@marwes-ui/core";
 *
 * <BadgeGroup label="Status">
 *   <Badge variant={BadgeVariant.success}>Active</Badge>
 *   <Badge variant={BadgeVariant.warning}>Pending review</Badge>
 * </BadgeGroup>
 * ```
 */

import * as React from "react"
import { Text } from "../text"

export interface BadgeGroupProps {
  /** Visible label for the badge group. */
  label: React.ReactNode

  /** Badge children to render inside the group. */
  children: React.ReactNode

  /** Additional CSS class names. */
  className?: string

  /** Explicit ID. If omitted, generated via useId(). */
  id?: string

  /** Data attributes for AI-friendly metadata (used by context variants). */
  dataAttributes?: Record<string, string>
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function BadgeGroup(props: BadgeGroupProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-badge-group-${reactId}`
  const labelId = `${id}-label`

  const className = cx("mw-badge-group", props.className)

  return (
    <fieldset className={className} aria-labelledby={labelId} {...props.dataAttributes}>
      <legend className="mw-badge-group__label" id={labelId}>
        <Text variant="caption">{props.label}</Text>
      </legend>
      <div className="mw-badge-group__items">{props.children}</div>
    </fieldset>
  )
}
