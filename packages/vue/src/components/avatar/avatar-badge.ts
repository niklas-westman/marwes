import { type AvatarOptions, createAvatarRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Avatar, type AvatarProps } from "./avatar"

export type AvatarBadgeProps = AvatarProps & {
  statusLabel?: string
}

const avatarBadgePropKeys = [
  "size",
  "type",
  "initials",
  "src",
  "alt",
  "iconName",
  "decorative",
  "ariaLabel",
  "label",
  "className",
  "dataAttributes",
  "statusLabel",
] as const

function buildAvatarOptions(props: AvatarBadgeProps, nativeAriaLabel?: string): AvatarOptions {
  const avatarOptions: AvatarOptions = {}
  if (props.size !== undefined) avatarOptions.size = props.size
  if (props.type !== undefined) avatarOptions.type = props.type
  if (props.initials !== undefined) avatarOptions.initials = props.initials
  if (props.src !== undefined) avatarOptions.src = props.src
  if (props.alt !== undefined) avatarOptions.alt = props.alt
  if (props.iconName !== undefined) avatarOptions.iconName = props.iconName
  if (props.decorative !== undefined) avatarOptions.decorative = props.decorative

  const resolvedAriaLabel = props.ariaLabel ?? nativeAriaLabel
  if (resolvedAriaLabel !== undefined) {
    avatarOptions.ariaLabel = resolvedAriaLabel
  }
  if (props.label !== undefined) {
    avatarOptions.label = props.label
  }

  return avatarOptions
}

function resolveAvatarBadgeLabel(
  avatarOptions: AvatarOptions,
  statusLabel: string,
): string | undefined {
  const avatarKit = createAvatarRecipe(avatarOptions)

  if (avatarKit.a11y.ariaHidden) {
    return undefined
  }

  if (avatarKit.content.type === "image") {
    return avatarKit.content.alt ? `${avatarKit.content.alt}, ${statusLabel}` : statusLabel
  }

  return avatarKit.a11y.ariaLabel ? `${avatarKit.a11y.ariaLabel}, ${statusLabel}` : statusLabel
}

export const AvatarBadge = defineComponent(
  (props: AvatarBadgeProps) => {
    const attrs = useAttrs()
    const nativeAriaLabel =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined

    const avatarOptions = computed(() => buildAvatarOptions(props, nativeAriaLabel))
    const avatarKit = computed(() => createAvatarRecipe(avatarOptions.value))
    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-avatar-badge",
        `mw-avatar-badge--${avatarKit.value.dataAttributes["data-size"]}`,
        props.className,
        attrs.class,
      ),
    )

    return () => {
      const resolvedStatusLabel = props.statusLabel ?? "Online"
      const accessibleLabel = resolveAvatarBadgeLabel(avatarOptions.value, resolvedStatusLabel)
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "aria-label"])

      const innerAvatarProps: AvatarProps = {
        decorative: true,
      }
      if (props.size !== undefined) innerAvatarProps.size = props.size
      if (props.type !== undefined) innerAvatarProps.type = props.type
      if (props.initials !== undefined) innerAvatarProps.initials = props.initials
      if (props.src !== undefined) innerAvatarProps.src = props.src
      if (props.alt !== undefined) innerAvatarProps.alt = props.alt
      if (props.iconName !== undefined) innerAvatarProps.iconName = props.iconName
      const resolvedInnerAriaLabel = props.ariaLabel ?? nativeAriaLabel
      if (resolvedInnerAriaLabel !== undefined) {
        innerAvatarProps.ariaLabel = resolvedInnerAriaLabel
      }
      if (props.label !== undefined) {
        innerAvatarProps.label = props.label
      }

      return h(
        "span",
        {
          ...passthroughAttrs,
          ...(props.dataAttributes ?? {}),
          class: wrapperClass.value,
          style: attrs.style,
          "data-component": "avatar-badge",
          "data-size": avatarKit.value.dataAttributes["data-size"],
          "data-status": "online",
          role: props.decorative ? undefined : "img",
          "aria-hidden": props.decorative ? "true" : undefined,
          "aria-label": props.decorative ? undefined : accessibleLabel,
        },
        [
          h(Avatar, innerAvatarProps),
          h("span", {
            class: "mw-avatar-badge__indicator",
            "aria-hidden": "true",
          }),
        ],
      )
    }
  },
  {
    name: "MarwesAvatarBadge",
    inheritAttrs: false,
    props: [...avatarBadgePropKeys],
  },
)
