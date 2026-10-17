import { IconName } from "../icon/icon-types"
import type { ButtonOptions } from "./button-types"

type ButtonIcons = Pick<ButtonOptions, "iconLeft" | "iconRight">

/** Canonical Figma purpose selections. An explicit caller icon always wins. */
export function resolveButtonIcons(
  options: Pick<ButtonOptions, "iconLeft" | "iconRight" | "dataAttributes">,
): ButtonIcons {
  const explicit: ButtonIcons = {
    ...(options.iconLeft ? { iconLeft: options.iconLeft } : {}),
    ...(options.iconRight ? { iconRight: options.iconRight } : {}),
  }
  if (options.iconLeft || options.iconRight) return explicit
  switch (options.dataAttributes?.["data-purpose"]) {
    case "confirm":
    case "success":
      return { iconRight: IconName.Check }
    case "destructive":
      return { iconRight: IconName.X }
    case "verify":
      return { iconLeft: IconName.CheckCircle }
    case "edit":
      return { iconLeft: IconName.Edit }
    case "upload":
      return { iconLeft: IconName.Upload }
    case "download":
      return { iconLeft: IconName.Download }
    case "search":
      return { iconLeft: IconName.Search }
    case "refresh":
      return { iconLeft: IconName.RefreshCw }
    default:
      return explicit
  }
}
