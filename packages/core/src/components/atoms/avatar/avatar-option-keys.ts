import { defineOptionKeys } from "../../../shared/option-keys"
import type { AvatarOptions } from "./avatar-types"

// Feeds every adapter that needs a runtime list of option names (e.g. Vue props); adding a
// AvatarOptions field fails to compile until it is listed here.
export const avatarOptionKeys = defineOptionKeys<AvatarOptions>({
  size: true,
  type: true,
  initials: true,
  src: true,
  alt: true,
  iconName: true,
  decorative: true,
  ariaLabel: true,
  label: true,
})
