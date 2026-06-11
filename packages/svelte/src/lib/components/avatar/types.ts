import type { AvatarOptions } from "@marwes-ui/core"

export interface AvatarProps extends AvatarOptions {
  class?: string
  style?: string | undefined
  dataAttributes?: Record<string, string>
}

export interface AvatarBadgeProps extends AvatarProps {
  statusLabel?: string
}

export interface AvatarGroupItem extends Omit<AvatarProps, "size" | "class" | "style"> {
  id?: string
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[]
  overflowCount?: number
  overflowLabel?: string
  ariaLabel?: string
  dataAttributes?: Record<string, string>
  class?: string
}

export type ProfileAvatarProps = AvatarProps

export interface PresenceAvatarProps extends AvatarProps {
  statusLabel?: string
}

export interface TeamAvatarGroupProps {
  items: AvatarGroupItem[]
  overflowCount?: number
  overflowLabel?: string
  ariaLabel?: string
  dataAttributes?: Record<string, string>
  class?: string
}
