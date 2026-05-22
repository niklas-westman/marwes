import styled from "styled-components"

type ShowcaseCardSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type ShowcaseTabletSpan = 1 | 2
type ShowcaseCardStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const Card = styled.div<{ $width?: string; $height?: string }>`
  background: var(--mw-color-surface-elevated, #ffffff);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  border: 1px solid var(--mw-color-border, #e5e5e5);
  flex-direction: column;
  gap: 16px;
  width: ${(p) => p.$width ?? "auto"};
  min-width: 0;
  min-height: ${(p) => p.$height ?? "auto"};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

const FlexCard = styled(Card)`
  flex: 1 1 0;

  @media (max-width: 768px) {
    flex-shrink: 1;
    max-width: none !important;
  }
`

const ShowcaseGrid = styled.div`
  --showcase-gap: clamp(16px, 2vw, 24px);

  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--showcase-gap);

  > * {
    min-width: 0;
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 899px) {
    grid-template-columns: minmax(0, 1fr);
  }
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

  @media (max-width: 1199px) {
    grid-column: span ${(p) => p.$tabletSpan ?? 1};
  }

  @media (max-width: 899px) {
    grid-column: 1 / -1;
  }
`

const CardTitle = styled.h3`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const CardSubtitle = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--mw-color-text-muted, #595959);
`

const ShowcaseSectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const ComponentLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--mw-color-text-muted, #595959);
`

export {
  Card,
  CardSubtitle,
  CardTitle,
  ComponentLabel,
  FlexCard,
  ShowcaseCard,
  ShowcaseGrid,
  ShowcaseSectionLabel,
}
