import styled from "styled-components"

import { Text } from "@marwes-ui/react"
import {
  cardShellStyles,
  compactLabelStyles,
  dashboardRowStyles,
  sectionLabelStyles,
} from "../../styles/theme-utils"

type ShowcaseCardSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type ShowcaseTabletSpan = 1 | 2
type ShowcaseCardStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const Card = styled.div<{ $width?: string; $height?: string }>`
  ${cardShellStyles}
  padding: ${({ theme }) => theme.spacing.sp24};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
  width: ${(p) => p.$width ?? "auto"};
  min-width: 0;
  min-height: ${(p) => p.$height ?? "auto"};
  flex-shrink: 0;

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp16};
  }
`

const FlexCard = styled(Card)`
  flex: 1 1 0;

  ${({ theme }) => theme.media.mobileAndBelow} {
    flex-shrink: 1;
    max-width: none !important;
  }
`

const ShowcaseGrid = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  > * {
    min-width: 0;
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-template-columns: minmax(0, 1fr);
  }
`

const ShowcaseRow = styled.div`
  ${dashboardRowStyles}
`

const ShowcaseStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
`

const ShowcaseCard = styled(Card)<{
  $desktopSpan?: ShowcaseCardSpan
  $desktopStart?: ShowcaseCardStart
  $tabletSpan?: ShowcaseTabletSpan
}>`
  width: auto;
  grid-column: ${(p) =>
    p.$desktopStart
      ? `${p.$desktopStart} / span ${p.$desktopSpan ?? 4}`
      : `span ${p.$desktopSpan ?? 4}`};
  flex-shrink: 1;

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-column: span ${(p) => p.$tabletSpan ?? 1};
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-column: 1 / -1;
  }
`

const CardTitle = styled.h3`
  ${sectionLabelStyles}
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};
`

const CardSubtitle = styled.span`
  font-family: ${({ theme }) => theme.font.primary};
  font-size: 0.6875rem;
  font-weight: 400;
  color: ${({ theme }) => theme.color.textMuted};
`

const ShowcaseSectionLabel = styled(Text)`
  ${sectionLabelStyles}
  color: ${({ theme }) => theme.color.textMuted};
`

const ComponentLabel = styled.span`
  ${compactLabelStyles}
  color: ${({ theme }) => theme.color.textMuted};
`

export {
  Card,
  CardSubtitle,
  CardTitle,
  ComponentLabel,
  FlexCard,
  ShowcaseCard,
  ShowcaseGrid,
  ShowcaseRow,
  ShowcaseSectionLabel,
  ShowcaseStack,
}
