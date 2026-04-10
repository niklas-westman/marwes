import { resolveAvatarA11y } from "./avatar-a11y"
import { AvatarSize, AvatarType } from "./avatar-types"
import type {
  AvatarOptions,
  AvatarRenderContent,
  AvatarRenderKit,
  AvatarSize as AvatarSizeValue,
  AvatarType as AvatarTypeValue,
} from "./avatar-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function normalizeAvatarInitials(initials?: string): string | undefined {
  if (!initials) {
    return undefined
  }

  const compactInitials = initials.trim().replace(/\s+/g, "")
  if (!compactInitials) {
    return undefined
  }

  return Array.from(compactInitials).slice(0, 2).join("").toUpperCase()
}

function resolveAvatarType(options: AvatarOptions, normalizedInitials?: string): AvatarTypeValue {
  if (options.type === AvatarType.image && options.src) {
    return AvatarType.image
  }

  if (options.type === AvatarType.initials && normalizedInitials) {
    return AvatarType.initials
  }

  if (options.type === AvatarType.icon) {
    return AvatarType.icon
  }

  if (options.src) {
    return AvatarType.image
  }

  if (normalizedInitials) {
    return AvatarType.initials
  }

  return AvatarType.icon
}

function createAvatarRenderContent(
  options: AvatarOptions,
  resolvedType: AvatarTypeValue,
  normalizedInitials?: string,
): AvatarRenderContent {
  if (resolvedType === AvatarType.image) {
    const imageContent: AvatarRenderContent = {
      type: AvatarType.image,
    }

    if (options.src) {
      imageContent.src = options.src
    }

    const imageAlt = options.alt ?? options.ariaLabel
    if (imageAlt) {
      imageContent.alt = imageAlt
    }

    return imageContent
  }

  if (resolvedType === AvatarType.initials) {
    const initialsContent: AvatarRenderContent = {
      type: AvatarType.initials,
    }

    if (normalizedInitials) {
      initialsContent.initials = normalizedInitials
    }

    return initialsContent
  }

  return {
    type: AvatarType.icon,
    iconName: options.iconName ?? "user",
  }
}

export function createAvatarRecipe(options: AvatarOptions = {}): AvatarRenderKit {
  const size: AvatarSizeValue = options.size ?? AvatarSize.medium
  const normalizedInitials = normalizeAvatarInitials(options.initials)
  const resolvedType = resolveAvatarType(options, normalizedInitials)

  return {
    tag: "span",
    className: cx("mw-avatar", `mw-avatar--${size}`, `mw-avatar--${resolvedType}`),
    vars: {},
    a11y: resolveAvatarA11y(options, resolvedType, normalizedInitials),
    dataAttributes: {
      "data-component": "avatar",
      "data-size": size,
      "data-type": resolvedType,
    },
    content: createAvatarRenderContent(options, resolvedType, normalizedInitials),
  }
}
