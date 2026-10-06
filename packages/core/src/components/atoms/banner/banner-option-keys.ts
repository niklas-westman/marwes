import { defineOptionKeys } from "../../../shared/option-keys"
import type { BannerOptions } from "./banner-types"

// Feeds every adapter that needs a runtime list of option names (e.g. Vue props); adding a
// BannerOptions field fails to compile until it is listed here.
export const bannerOptionKeys = defineOptionKeys<BannerOptions>({
  variant: true,
  showIcon: true,
  showAction: true,
  dismissible: true,
  ariaLabel: true,
})
