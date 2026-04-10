import { AvatarType } from "./avatar-types"
import type { AvatarA11yProps, AvatarOptions, AvatarType as AvatarTypeValue } from "./avatar-types"

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
    return {}
  }

  const accessibleLabel = options.ariaLabel ?? normalizedInitials ?? "Avatar"

  return {
    role: "img",
    ariaLabel: accessibleLabel,
  }
}
