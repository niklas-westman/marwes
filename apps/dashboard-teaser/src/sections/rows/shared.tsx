import styled from "styled-components"

const Card = styled.div<{ $width?: string; $height?: string }>`
  background: var(--mw-color-surface, #ffffff);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: ${(p) => p.$width ?? "auto"};
  min-height: ${(p) => p.$height ?? "auto"};
  flex-shrink: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

const FlexCard = styled(Card)`
  flex: 1;

  @media (max-width: 768px) {
    flex-shrink: 1;
    max-width: none !important;
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

const ComponentLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--mw-color-text-muted, #595959);
`

export { Card, CardSubtitle, CardTitle, ComponentLabel, FlexCard }
