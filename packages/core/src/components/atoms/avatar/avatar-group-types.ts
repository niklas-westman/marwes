export interface AvatarGroupOptions {
  overflowCount?: number
  /** Accessible name of the overflow counter. Defaults to "{count} more people". */
  overflowLabel?: string
  /** Accessible name of the group. Takes precedence over `label`. */
  ariaLabel?: string
  /** Alias for `ariaLabel`. */
  label?: string
}

/** ARIA fields for the avatar group wrapper (a fieldset, so an implicit group). */
export interface AvatarGroupA11yProps {
  ariaLabel: string
}

/** ARIA fields for the "+N" overflow counter, exposed as a single labelled image. */
export interface AvatarGroupCounterA11yProps {
  role: "img"
  ariaLabel: string
}

export interface AvatarGroupRenderKit {
  className: string
  dataAttributes: { "data-component": "avatar-group" }
  a11y: AvatarGroupA11yProps
  counter: {
    visible: boolean
    text: string
    a11y: AvatarGroupCounterA11yProps
  }
}
