import type * as React from "react"
import { Avatar, type AvatarProps } from "./avatar"
import { AvatarBadge, type AvatarBadgeProps } from "./avatar-badge"
import { AvatarGroup, type AvatarGroupProps } from "./avatar-group"

export type ProfileAvatarProps = AvatarProps

export function ProfileAvatar(props: ProfileAvatarProps): React.ReactElement {
  return (
    <Avatar
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "profile",
      }}
    />
  )
}

export type PresenceAvatarProps = AvatarBadgeProps

export function PresenceAvatar(props: PresenceAvatarProps): React.ReactElement {
  return (
    <AvatarBadge
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "presence",
      }}
    />
  )
}

export type TeamAvatarGroupProps = AvatarGroupProps

export function TeamAvatarGroup(props: TeamAvatarGroupProps): React.ReactElement {
  return (
    <AvatarGroup
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "team",
      }}
    />
  )
}
