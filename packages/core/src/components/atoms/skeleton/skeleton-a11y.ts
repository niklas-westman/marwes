import type { SkeletonA11yProps, SkeletonOptions } from "./skeleton-types"

function isDev(): boolean {
  const p = (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process

  const nodeEnv = p?.env?.NODE_ENV
  if (nodeEnv) return nodeEnv !== "production"

  const meta = import.meta as unknown as {
    env?: { MODE?: string; PROD?: boolean }
  }
  if (typeof meta.env?.PROD === "boolean") return !meta.env.PROD
  if (meta.env?.MODE) return meta.env.MODE !== "production"

  return true
}

const __DEV__ = isDev()

export function resolveSkeletonA11y(options: SkeletonOptions = {}): SkeletonA11yProps {
  if (options.decorative === true) {
    return {
      ...(options.id ? { id: options.id } : {}),
      ariaHidden: true,
    }
  }

  if (options.ariaLabel) {
    return {
      ...(options.id ? { id: options.id } : {}),
      role: "status",
      ariaLabel: options.ariaLabel,
      ariaLive: "polite",
    }
  }

  if (__DEV__ && options.decorative === false) {
    console.warn(
      "[marwes] Skeleton: decorative={false} was passed without ariaLabel. " +
        "The skeleton stays hidden from assistive technology unless ariaLabel is also provided.",
    )
  }

  return {
    ...(options.id ? { id: options.id } : {}),
    ariaHidden: true,
  }
}
