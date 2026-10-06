import type { IconA11yProps, IconOptions } from "./icon-types"

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

export function resolveIconA11y(
  options: Pick<IconOptions, "ariaLabel" | "ariaHidden" | "decorative">,
): IconA11yProps {
  // Explicitly hidden wins over a label: the caller is saying assistive tech should skip it.
  if (options.ariaHidden === true) return { ariaHidden: true }

  if (options.ariaLabel) {
    return {
      role: "img",
      ariaLabel: options.ariaLabel,
    }
  }

  if (__DEV__ && options.decorative === false) {
    console.warn(
      "[marwes] Icon: decorative={false} was passed without ariaLabel. " +
        "The icon stays hidden from assistive technology unless ariaLabel is also provided.",
    )
  }

  if (__DEV__ && options.ariaHidden === false) {
    console.warn(
      "[marwes] Icon: ariaHidden={false} was passed without ariaLabel. " +
        "An unlabelled icon stays hidden from assistive technology.",
    )
  }

  return { ariaHidden: true }
}
