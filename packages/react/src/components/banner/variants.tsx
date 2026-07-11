/**
 * Purpose Components — Banner
 *
 * Thin semantic wrappers that preset the `variant` prop and emit
 * canonical `data-purpose` and `data-intent` metadata.
 */

import { createPurposeSemanticAttributes } from "@marwes-ui/core"
import type * as React from "react"
import { Banner, type BannerProps } from "./banner"

// ============================================================================
// INFO BANNER
// ============================================================================

export type InfoBannerProps = Omit<BannerProps, "variant">

/**
 * InfoBanner - Informational page-level messages.
 *
 * @example
 * ```tsx
 * <InfoBanner>Your profile has been updated.</InfoBanner>
 * ```
 */
export function InfoBanner(props: InfoBannerProps): React.ReactElement {
  const purposeAttrs = createPurposeSemanticAttributes("info-banner")
  return (
    <Banner
      {...props}
      variant="info"
      data-purpose={purposeAttrs["data-purpose"]}
      data-intent={purposeAttrs["data-intent"]}
    />
  )
}

// ============================================================================
// SUCCESS BANNER
// ============================================================================

export type SuccessBannerProps = Omit<BannerProps, "variant">

/**
 * SuccessBanner - Positive confirmation messages.
 *
 * @example
 * ```tsx
 * <SuccessBanner>Payment processed successfully.</SuccessBanner>
 * ```
 */
export function SuccessBanner(props: SuccessBannerProps): React.ReactElement {
  const purposeAttrs = createPurposeSemanticAttributes("success-banner")
  return (
    <Banner
      {...props}
      variant="success"
      data-purpose={purposeAttrs["data-purpose"]}
      data-intent={purposeAttrs["data-intent"]}
    />
  )
}

// ============================================================================
// WARNING BANNER
// ============================================================================

export type WarningBannerProps = Omit<BannerProps, "variant">

/**
 * WarningBanner - Caution or upcoming deadline messages.
 *
 * @example
 * ```tsx
 * <WarningBanner>Your subscription expires in 3 days.</WarningBanner>
 * ```
 */
export function WarningBanner(props: WarningBannerProps): React.ReactElement {
  const purposeAttrs = createPurposeSemanticAttributes("warning-banner")
  return (
    <Banner
      {...props}
      variant="warning"
      data-purpose={purposeAttrs["data-purpose"]}
      data-intent={purposeAttrs["data-intent"]}
    />
  )
}

// ============================================================================
// ERROR BANNER
// ============================================================================

export type ErrorBannerProps = Omit<BannerProps, "variant">

/**
 * ErrorBanner - Error or critical issue messages.
 *
 * @example
 * ```tsx
 * <ErrorBanner>Failed to save changes. Please try again.</ErrorBanner>
 * ```
 */
export function ErrorBanner(props: ErrorBannerProps): React.ReactElement {
  const purposeAttrs = createPurposeSemanticAttributes("error-banner")
  return (
    <Banner
      {...props}
      variant="error"
      data-purpose={purposeAttrs["data-purpose"]}
      data-intent={purposeAttrs["data-intent"]}
    />
  )
}
