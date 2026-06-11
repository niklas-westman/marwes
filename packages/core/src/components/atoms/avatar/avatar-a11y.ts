import { AvatarType } from "./avatar-types"
import type { AvatarA11yProps, AvatarOptions, AvatarType as AvatarTypeValue } from "./avatar-types"

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

export function resolveAvatarA11y(
  options: AvatarOptions,
  resolvedType: AvatarTypeValue,
  normalizedInitials?: string,
): AvatarA11yProps {
  if (options.decorative) {
    return {
      ariaHidden: true,
    }
  }

  if (resolvedType === AvatarType.image) {
    // Image avatars rely on the <img alt> attribute in the adapter.
    // Warn in development when neither alt nor ariaLabel is provided so the
    // image silently becomes decorative without the team intending it.
    const imageAccessibleLabel = options.ariaLabel ?? options.label

    if (__DEV__ && !options.alt && !imageAccessibleLabel) {
      console.warn(
        "[marwes] Avatar: an image avatar was rendered without alt text, ariaLabel, or label. " +
          "Provide alt to describe the person, ariaLabel/label as a fallback, or use " +
          "decorative={true} to explicitly mark it as presentational.",
      )
    }

    return {}
  }

  const accessibleLabel = options.ariaLabel ?? options.label ?? normalizedInitials ?? "Avatar"

  return {
    role: "img",
    ariaLabel: accessibleLabel,
  }
}
