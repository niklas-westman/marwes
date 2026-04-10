import { SpinnerVariants } from "../spinner/spinner-types"
import type { ButtonLoadingOptions, ResolvedButtonLoading } from "./button-types"

export function resolveButtonLoading(
  loading?: boolean | ButtonLoadingOptions,
): ResolvedButtonLoading {
  if (!loading) {
    return {
      isLoading: false,
      disableWhileLoading: true,
      spinnerVariant: SpinnerVariants.classic,
    }
  }

  if (loading === true) {
    return {
      isLoading: true,
      disableWhileLoading: true,
      spinnerVariant: SpinnerVariants.classic,
    }
  }

  return {
    isLoading: loading.isLoading,
    disableWhileLoading: loading.disableWhileLoading ?? true,
    spinnerVariant: loading.spinnerVariant ?? SpinnerVariants.classic,
    ...(loading.loadingLabel !== undefined ? { loadingLabel: loading.loadingLabel } : {}),
  }
}
