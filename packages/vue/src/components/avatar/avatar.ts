import {
  type AvatarOptions,
  type AvatarRenderContent,
  type CssVars,
  createAvatarRecipe,
} from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

export type AvatarProps = AvatarOptions & {
  className?: string
  dataAttributes?: Record<string, string>
}

const avatarPropKeys = [
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
] as const

function renderAvatarContent(
  content: AvatarRenderContent,
  isOuterShellAccessible: boolean,
  isDecorative: boolean,
) {
  if (content.type === "image") {
    return h("img", {
      class: "mw-avatar__image",
      src: content.src,
      alt: isDecorative ? "" : (content.alt ?? ""),
    })
  }

  if (content.type === "initials") {
    return h(
      "span",
      {
        class: "mw-avatar__initials",
        "aria-hidden": isOuterShellAccessible ? "true" : undefined,
      },
      content.initials,
    )
  }

  return h(Icon, {
    name: content.iconName ?? "user",
    className: "mw-avatar__icon",
    decorative: true,
  })
}

export const Avatar = defineComponent(
  (props: AvatarProps) => {
    const attrs = useAttrs()
    const ariaLabelFromAttrs =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined

    const kit = computed(() => {
      const avatarOptions: AvatarOptions = {}
      if (props.size !== undefined) avatarOptions.size = props.size
      if (props.type !== undefined) avatarOptions.type = props.type
      if (props.initials !== undefined) avatarOptions.initials = props.initials
      if (props.src !== undefined) avatarOptions.src = props.src
      if (props.alt !== undefined) avatarOptions.alt = props.alt
      if (props.iconName !== undefined) avatarOptions.iconName = props.iconName
      if (props.decorative !== undefined) avatarOptions.decorative = props.decorative

      const resolvedAriaLabel = props.ariaLabel ?? ariaLabelFromAttrs
      if (resolvedAriaLabel !== undefined) {
        avatarOptions.ariaLabel = resolvedAriaLabel
      }
      if (props.label !== undefined) {
        avatarOptions.label = props.label
      }

      return createAvatarRecipe(avatarOptions)
    })

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, [
        "class",
        "style",
        "aria-label",
      ])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)
      const isOuterShellAccessible = renderKit.a11y.role === "img"
      const isDecorative = renderKit.a11y.ariaHidden === true

      return h(
        "span",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          ...(props.dataAttributes ?? {}),
          class: className,
          style,
          role: renderKit.a11y.role,
          "aria-hidden": isDecorative ? "true" : undefined,
          "aria-label": renderKit.a11y.ariaLabel,
        },
        renderAvatarContent(renderKit.content, isOuterShellAccessible, isDecorative),
      )
    }
  },
  {
    name: "MarwesAvatar",
    inheritAttrs: false,
    props: [...avatarPropKeys],
  },
)
