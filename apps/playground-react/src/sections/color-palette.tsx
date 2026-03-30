import styled from "styled-components"

import { PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const COLOR_SWATCHES = ["base", "hover", "pressed", "disabled", "label"] as const

const SwatchContainer = styled.div`
  margin-bottom: 16px;
`

const SwatchRoleLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: capitalize;
  color: var(--mw-color-text);
  opacity: 0.7;
`

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
`

const Swatch = styled.div`
  padding: 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;

  span {
    display: block;
    opacity: 0.6;
    font-size: 10px;
    margin-top: 4px;
    font-family: ui-monospace, monospace;
  }
`

function SwatchRow({ colorRole }: { colorRole: string }): JSX.Element {
  return (
    <SwatchContainer>
      <SwatchRoleLabel>{colorRole}</SwatchRoleLabel>
      <SwatchGrid>
        {COLOR_SWATCHES.map((state) => {
          const background =
            state === "label"
              ? `var(--mw-color-${colorRole}-base)`
              : `var(--mw-color-${colorRole}-${state})`

          return (
            <Swatch
              key={state}
              style={{
                background,
                color: `var(--mw-color-${colorRole}-label)`,
              }}
            >
              {state}
              <span>{`--mw-color-${colorRole}-${state}`}</span>
            </Swatch>
          )
        })}
      </SwatchGrid>
    </SwatchContainer>
  )
}

function ColorPaletteSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Derived Color Palette</SectionTitle>
      <SectionDescription>
        String theme colors derive hover, pressed, disabled, and label tokens automatically.
        Object-form color inputs can override `label` and `labelDisabled` when a preset or app wants
        white text/icons on a brand fill.
      </SectionDescription>
      <SwatchRow colorRole="primary" />
      <SwatchRow colorRole="danger" />
      <SwatchRow colorRole="success" />
      <SwatchRow colorRole="warning" />
    </PreviewSection>
  )
}

export { ColorPaletteSection }
