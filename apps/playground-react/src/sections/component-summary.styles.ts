import { mwThemeVars } from "@marwes-ui/react"
import styled from "styled-components"

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${mwThemeVars.spacing.sp16};
  margin-bottom: ${mwThemeVars.spacing.sp48};
`

interface PreviewCellProps {
  $col?: string
  $row?: string
}

const PreviewCell = styled.div<PreviewCellProps>`
  background: ${mwThemeVars.color.surface};
  border: 1px solid color-mix(in srgb, var(--mw-color-text, #111) 12%, transparent);
  border-radius: calc(${mwThemeVars.ui.radius} * 3);
  padding: ${mwThemeVars.spacing.sp16};
  grid-column: ${({ $col }) => $col ?? "auto"};
  grid-row: ${({ $row }) => $row ?? "auto"};
  min-width: 0;
`

const PreviewCellLabel = styled.p`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${mwThemeVars.color.text};
  opacity: 0.4;
  margin: 0 0 12px;
`

const PreviewIconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`

const PreviewIconCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--mw-color-text, #111) 15%, transparent);
  border-radius: 6px;
`

const PreviewHeroBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PreviewHeroActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`

export {
  PreviewCell,
  PreviewCellLabel,
  PreviewGrid,
  PreviewHeroActions,
  PreviewHeroBody,
  PreviewIconCell,
  PreviewIconGrid,
}
