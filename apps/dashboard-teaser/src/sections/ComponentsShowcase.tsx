import styled from "styled-components"

import { MarwesProvider, Text, TextVariant } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"

import { ThemePicker } from "../components/ThemePicker"
import { dashboardRowStyles, responsiveShellPadding } from "../styles/theme-utils"
import { createDashboardThemeInput } from "./playground-settings"
import type { PlaygroundColorVision, PlaygroundSettings } from "./playground-settings"
import { RowAccordionInput } from "./rows/RowAccordionInput"
import { RowAvatarBreadcrumbDialog } from "./rows/RowAvatarBreadcrumbDialog"
import { RowBanner } from "./rows/RowBanner"
import { RowButtonPaginationProgress } from "./rows/RowButtonPaginationProgress"
import { RowSegmented } from "./rows/RowSegmented"
import { RowSpinner } from "./rows/RowSpinner"
import { RowSwitchCard } from "./rows/RowSwitchCard"
import { RowToastMenuAvatar } from "./rows/RowToastMenuAvatar"
import {
  type ThemePresetId,
  applyThemePreset,
  getActivePresetId,
  themePresets,
} from "./theme-presets"

const ShowcaseContainer = styled.section`
  width: 100%;
  padding: 0 ${({ theme }) => responsiveShellPadding(theme)};
`

const ShowcaseLayout = styled.div`
  width: 100%;
  max-width: ${({ theme }) =>
    `calc(${theme.breakpoint.wideDesktop}px - (${theme.spacing.sp72} * 2))`};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: ${({ theme }) => `clamp(${theme.spacing.sp24}, 3vw, ${theme.spacing.sp32})`};
`

const ContentGrid = styled.div`
  width: 100%;
  min-width: 0;
  container-type: inline-size;
  background: ${({ theme }) => theme.color.surface};
  /* Fixed radius — dashboard chrome, not part of the previewed theme. */
  border-radius: 2rem;
  padding: ${({ theme }) => `clamp(${theme.spacing.sp16}, 3vw, ${theme.spacing.sp32})`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  ${({ theme }) => theme.media.mobileAndBelow} {
    border-radius: 1.5rem;
  }
`

const ShowcaseHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sp16};
  flex-wrap: wrap;
`

const NowViewing = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.textMuted};

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: 600;
  }
`

const PreviewThemeScope = styled.div`
  min-width: 0;

  > [data-marwes-theme="true"] {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};
    background: transparent !important;
  }

  /* Morph tokens between preset switches. Outline is left untouched so the
     focus ring stays instant. */
  > [data-marwes-theme="true"],
  > [data-marwes-theme="true"] * {
    transition: background-color 240ms ease, border-color 240ms ease,
      color 240ms ease, fill 240ms ease, stroke 240ms ease,
      border-radius 240ms ease, box-shadow 240ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    > [data-marwes-theme="true"],
    > [data-marwes-theme="true"] * {
      transition: none;
    }
  }

  /* Cap radius on components whose shape gets weird at large radii. The radius
     slider still scales smaller components (Button, Badge, Input, etc.) up to 48px;
     these two stop scaling at the value below. */
  .mw-card {
    --mw-card-radius: min(calc(var(--mw-ui-radius, 4px) * 2), 20px);
  }

  .mw-accordion {
    border-radius: min(var(--mw-ui-radius, 6px), 12px);
  }

  &[data-dashboard-color-vision="protanopia"] > [data-marwes-theme="true"] {
    filter: url("#dashboard-cvd-protanopia");
  }

  &[data-dashboard-color-vision="deuteranopia"] > [data-marwes-theme="true"] {
    filter: url("#dashboard-cvd-deuteranopia");
  }

  &[data-dashboard-color-vision="tritanopia"] > [data-marwes-theme="true"] {
    filter: url("#dashboard-cvd-tritanopia");
  }
`

const Row = styled.div`
  ${dashboardRowStyles}
`

type ComponentsShowcaseProps = {
  settings: PlaygroundSettings
  onSettingsChange: Dispatch<SetStateAction<PlaygroundSettings>>
}

function ColorVisionFilters(): JSX.Element {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="dashboard-cvd-protanopia">
          <feColorMatrix
            values="0.567 0.433 0 0 0
                    0.558 0.442 0 0 0
                    0 0.242 0.758 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="dashboard-cvd-deuteranopia">
          <feColorMatrix
            values="0.625 0.375 0 0 0
                    0.7 0.3 0 0 0
                    0 0.3 0.7 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="dashboard-cvd-tritanopia">
          <feColorMatrix
            values="0.95 0.05 0 0 0
                    0 0.433 0.567 0 0
                    0 0.475 0.525 0 0
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  )
}

function getColorVisionAttribute(
  colorVision: PlaygroundColorVision,
): PlaygroundColorVision | undefined {
  return colorVision === "normal" ? undefined : colorVision
}

function ComponentsShowcase({ settings, onSettingsChange }: ComponentsShowcaseProps): JSX.Element {
  const { componentOptions } = settings
  const previewThemeInput = createDashboardThemeInput(settings)
  const colorVisionAttribute = getColorVisionAttribute(settings.accessibility.colorVision)
  const activePresetId = getActivePresetId(settings) ?? "marwes"
  const activePreset =
    themePresets.find((preset) => preset.id === activePresetId) ?? themePresets[0]

  const handleThemePresetChange = (nextId: ThemePresetId): void => {
    const preset = themePresets.find((p) => p.id === nextId)
    if (!preset) return
    onSettingsChange((prev) => applyThemePreset(prev, preset))
  }

  return (
    <ShowcaseContainer id="components" data-dashboard-section="components">
      <ColorVisionFilters />
      <ShowcaseLayout>
        <ThemePicker
          activePresetId={activePresetId}
          currentMode={settings.mode}
          onSelect={handleThemePresetChange}
        />
        <ContentGrid>
          <ShowcaseHead>
            <Text variant={TextVariant.overline}>Components</Text>
            <NowViewing>
              Now viewing <strong>{activePreset.name}</strong> — {activePreset.description}
            </NowViewing>
          </ShowcaseHead>
          <PreviewThemeScope data-dashboard-color-vision={colorVisionAttribute}>
            <MarwesProvider theme={previewThemeInput}>
              <Row>
                <RowSwitchCard options={componentOptions} />
              </Row>
              <Row>
                <RowAccordionInput options={componentOptions} />
              </Row>
              <Row>
                <RowToastMenuAvatar options={componentOptions} />
              </Row>
              <Row>
                <RowAvatarBreadcrumbDialog options={componentOptions} />
              </Row>
              <Row>
                <RowBanner options={componentOptions} />
              </Row>
              <Row>
                <RowButtonPaginationProgress options={componentOptions} />
              </Row>
              <Row>
                <RowSegmented />
              </Row>
              <Row>
                <RowSpinner options={componentOptions} />
              </Row>
            </MarwesProvider>
          </PreviewThemeScope>
        </ContentGrid>
      </ShowcaseLayout>
    </ShowcaseContainer>
  )
}

export { ComponentsShowcase }
export type { ComponentsShowcaseProps }
