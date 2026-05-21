/**
 * Purpose Components — Banner (Vue)
 *
 * Thin semantic wrappers that preset the `variant` prop and emit
 * canonical `data-purpose` and `data-intent` metadata.
 */

import { createPurposeSemanticAttributes } from "@marwes-ui/core"
import { defineComponent, h, useAttrs } from "vue"
import type { BannerProps } from "./banner"
import { Banner } from "./banner"

export type InfoBannerProps = Omit<BannerProps, "variant">
export type SuccessBannerProps = Omit<BannerProps, "variant">
export type WarningBannerProps = Omit<BannerProps, "variant">
export type ErrorBannerProps = Omit<BannerProps, "variant">

const bannerVariantPropKeys = [
  "showIcon",
  "showAction",
  "dismissible",
  "ariaLabel",
  "className",
  "id",
] as const

function createPurposeBanner(name: string, variant: string, purpose: string) {
  return defineComponent(
    (props: Omit<BannerProps, "variant">, { slots, emit }) => {
      const attrs = useAttrs()
      const purposeAttrs = createPurposeSemanticAttributes(purpose as never)

      return () =>
        h(
          Banner,
          {
            ...attrs,
            ...props,
            variant: variant as never,
            "data-purpose": purposeAttrs["data-purpose"],
            "data-intent": purposeAttrs["data-intent"],
            onDismiss: () => emit("dismiss"),
          },
          slots,
        )
    },
    {
      name,
      inheritAttrs: false,
      props: [...bannerVariantPropKeys],
      emits: ["dismiss"],
    },
  )
}

export const InfoBanner = createPurposeBanner("MarwesInfoBanner", "info", "info-banner")
export const SuccessBanner = createPurposeBanner("MarwesSuccessBanner", "success", "success-banner")
export const WarningBanner = createPurposeBanner("MarwesWarningBanner", "warning", "warning-banner")
export const ErrorBanner = createPurposeBanner("MarwesErrorBanner", "error", "error-banner")
