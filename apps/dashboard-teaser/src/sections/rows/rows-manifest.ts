import type { ComponentType } from "react"

import type { ComponentDisplayOptions } from "../playground-settings"
import { RowAccordionInput } from "./RowAccordionInput"
import { RowAvatarBreadcrumbDialog } from "./RowAvatarBreadcrumbDialog"
import { RowBanner } from "./RowBanner"
import { RowButtonPaginationProgress } from "./RowButtonPaginationProgress"
import { RowSegmented } from "./RowSegmented"
import { RowSpinner } from "./RowSpinner"
import { RowSwitchCard } from "./RowSwitchCard"
import { RowToastMenuAvatar } from "./RowToastMenuAvatar"

type RowProps = { options: ComponentDisplayOptions }

type RowEntry =
  | { id: string; Component: ComponentType<RowProps>; needsOptions: true }
  | { id: string; Component: ComponentType; needsOptions: false }

const rowsManifest: RowEntry[] = [
  { id: "switch-card", Component: RowSwitchCard, needsOptions: true },
  { id: "accordion-input", Component: RowAccordionInput, needsOptions: true },
  { id: "toast-menu-avatar", Component: RowToastMenuAvatar, needsOptions: true },
  { id: "avatar-breadcrumb-dialog", Component: RowAvatarBreadcrumbDialog, needsOptions: true },
  { id: "banner", Component: RowBanner, needsOptions: true },
  { id: "button-pagination-progress", Component: RowButtonPaginationProgress, needsOptions: true },
  { id: "segmented", Component: RowSegmented, needsOptions: false },
  { id: "spinner", Component: RowSpinner, needsOptions: true },
]

export { rowsManifest }
export type { RowEntry }
