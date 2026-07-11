import styled from "styled-components"

import { Text, TextVariant } from "@marwes-ui/react"
import { cardShellStyles } from "../../theme/theme-utils"

const Card = styled.div<{
  $width?: string
  $height?: string
  $desktopWidth?: string
  $desktopHeight?: string
}>`
  ${cardShellStyles}
  position: relative;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.sp24};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
  width: ${(p) => p.$width ?? "auto"};
  min-width: 0;

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    width: ${(p) => p.$desktopWidth ?? p.$width ?? "auto"};
    min-height: ${(p) => p.$desktopHeight ?? p.$height ?? "auto"};
    padding: ${({ theme }) => theme.spacing.sp32};
    gap: ${({ theme }) => theme.spacing.sp24};
  }

  > span:first-child {
    color: ${({ theme }) => theme.color.textMuted};
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp16};
  }
`

const ShowcaseFlexRow = styled.div`
  --showcase-row-gap: ${({ theme }) => theme.spacing.sp24};

  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  gap: var(--showcase-row-gap);

  > * {
    min-width: 0;
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    --showcase-row-gap: ${({ theme }) => theme.spacing.sp16};
  }
`

const FlexAreaCard = styled(Card)<{
  $basis?: string
  $grow?: number
  $maxWidth?: string
  $minHeight?: string
  $order?: number
}>`
  flex: ${(p) => `${p.$grow ?? 1} 1 ${p.$basis ?? "0"}`};
  max-width: ${(p) => p.$maxWidth ?? "none"};
  order: ${(p) => p.$order ?? 0};
  width: auto;

  @container (max-width: 54rem) {
    flex-basis: calc((100% - var(--showcase-row-gap)) / 2);
    max-width: none;
  }

  @container (max-width: 38rem) {
    flex-basis: 100%;
  }
`

const ShowcaseStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    gap: ${({ theme }) => theme.spacing.sp24};
  }
`

const CardTitle = styled(Text).attrs({ variant: TextVariant.label })`
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};
`

const ShowcaseSectionLabel = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.textMuted};
`

export { Card, CardTitle, FlexAreaCard, ShowcaseFlexRow, ShowcaseSectionLabel, ShowcaseStack }
