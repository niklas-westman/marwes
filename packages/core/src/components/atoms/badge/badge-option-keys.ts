import { defineOptionKeys } from "../../../shared/option-keys"
import type { BadgeOptions } from "./badge-types"

// Feeds every adapter that needs a runtime list of option names (e.g. Vue props); adding a
// BadgeOptions field fails to compile until it is listed here.
export const badgeOptionKeys = defineOptionKeys<BadgeOptions>({
  variant: true,
  ariaLabel: true,
  label: true,
})
