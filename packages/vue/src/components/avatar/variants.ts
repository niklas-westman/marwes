import { defineComponent, h } from "vue"
import { Avatar, type AvatarProps } from "./avatar"
import { AvatarBadge, type AvatarBadgeProps } from "./avatar-badge"
import { AvatarGroup, type AvatarGroupProps } from "./avatar-group"

const avatarPropKeys = [
  "size",
  "type",
  "initials",
  "src",
  "alt",
  "iconName",
  "decorative",
  "ariaLabel",
  "className",
  "dataAttributes",
] as const

const avatarBadgePropKeys = [...avatarPropKeys, "statusLabel"] as const

const avatarGroupPropKeys = [
  "items",
  "overflowCount",
  "overflowLabel",
  "ariaLabel",
  "className",
  "dataAttributes",
] as const

export type ProfileAvatarProps = AvatarProps

export const ProfileAvatar = defineComponent({
  name: "MarwesProfileAvatar",
  inheritAttrs: false,
  props: [...avatarPropKeys],
  setup(rawProps, { attrs }) {
    const props = rawProps as unknown as ProfileAvatarProps

    return () =>
      h(Avatar, {
        ...attrs,
        ...props,
        dataAttributes: {
          ...props.dataAttributes,
          "data-purpose": "profile",
        },
      })
  },
})

export type PresenceAvatarProps = AvatarBadgeProps

export const PresenceAvatar = defineComponent({
  name: "MarwesPresenceAvatar",
  inheritAttrs: false,
  props: [...avatarBadgePropKeys],
  setup(rawProps, { attrs }) {
    const props = rawProps as unknown as PresenceAvatarProps

    return () =>
      h(AvatarBadge, {
        ...attrs,
        ...props,
        dataAttributes: {
          ...props.dataAttributes,
          "data-purpose": "presence",
        },
      })
  },
})

export type TeamAvatarGroupProps = AvatarGroupProps

export const TeamAvatarGroup = defineComponent({
  name: "MarwesTeamAvatarGroup",
  inheritAttrs: false,
  props: [...avatarGroupPropKeys],
  setup(rawProps, { attrs }) {
    const props = rawProps as unknown as TeamAvatarGroupProps

    return () =>
      h(AvatarGroup, {
        ...attrs,
        ...props,
        dataAttributes: {
          ...props.dataAttributes,
          "data-purpose": "team",
        },
      })
  },
})
