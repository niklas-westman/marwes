import type { BannerOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface BannerProps extends BannerOptions {
  children?: Snippet
  icon?: Snippet
  action?: Snippet
  ondismiss?: () => void
  class?: string
  id?: string
}

export type InfoBannerProps = Omit<BannerProps, "variant">
export type SuccessBannerProps = Omit<BannerProps, "variant">
export type WarningBannerProps = Omit<BannerProps, "variant">
export type ErrorBannerProps = Omit<BannerProps, "variant">
