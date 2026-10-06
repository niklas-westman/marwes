/** ARIA fields for the badge group wrapper (a fieldset labelled by its legend). */
export interface BadgeGroupA11yProps {
  ariaLabelledBy: string
}

export interface BadgeGroupRenderKit {
  className: string
  labelId: string
  a11y: BadgeGroupA11yProps
}
