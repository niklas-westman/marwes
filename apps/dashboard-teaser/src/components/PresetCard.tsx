import { Icon, IconName } from "@marwes-ui/react"
import styled from "styled-components"

import type { ThemePreset } from "../sections/theme-presets"

const ThemeCard = styled.label<{ $active: boolean; $accent: string }>`
  appearance: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  position: relative;
  background: ${({ theme }) => theme.color.surface};
  /* Active border uses the PRESET's own primary, not the shell's — so each
     active card reveals its preset identity (Editorial → wine red, Cyber →
     yellow, Nordic → slate, etc). */
  border: ${({ $active, $accent, theme }) =>
    $active ? `1px solid ${$accent}` : `1px solid ${theme.color.borderLow}`};
  ${({ $active, $accent }) => ($active ? `box-shadow: 0 0 0 1px ${$accent};` : "")}
  border-radius: ${({ theme }) => theme.spacing.sp16};
  padding: ${({ theme }) => theme.spacing.sp12};
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &:hover {
    border-color: ${({ $accent }) => $accent};
  }
`

const ThemeRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;

  &:focus-visible + ${ThemeCard} {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`

const ThemeCardField = styled.div`
  position: relative;
`

const CardSwatchStrip = styled.span`
  display: flex;
  gap: 5px;
  height: 24px;
`

const CardSwatch = styled.span<{ $color: string }>`
  flex: 1;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  border: 1px solid rgba(0, 0, 0, 0.08);
`

const CardCheckBadge = styled.span<{ $accent: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 22px;
  height: 22px;
  background: ${({ $accent }) => $accent};
  color: #ffffff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const CardName = styled.span`
  font-weight: 600;
  font-size: 13.5px;
  color: ${({ theme }) => theme.color.text};
`

const CardDescription = styled.span`
  font-size: 11.5px;
  line-height: 1.35;
  min-height: 30px;
  color: ${({ theme }) => theme.color.textMuted};
`

type PresetCardProps = {
  preset: ThemePreset
  isActive: boolean
  swatchColors: readonly string[]
  onSelect: () => void
  onCardClick?: () => void
}

function PresetCard({
  preset,
  isActive,
  swatchColors,
  onSelect,
  onCardClick,
}: PresetCardProps): JSX.Element {
  const inputId = `dashboard-theme-preset-${preset.id}`

  return (
    <ThemeCardField>
      <ThemeRadio
        id={inputId}
        type="radio"
        name="dashboard-theme-preset"
        checked={isActive}
        onChange={onSelect}
      />
      <ThemeCard
        htmlFor={inputId}
        $active={isActive}
        $accent={preset.primary}
        onClick={onCardClick}
      >
        <CardSwatchStrip>
          {swatchColors.map((color, index) => (
            <CardSwatch key={`${preset.id}-${index}`} $color={color} />
          ))}
        </CardSwatchStrip>
        <CardName>{preset.name}</CardName>
        <CardDescription>{preset.description}</CardDescription>
        {isActive ? (
          <CardCheckBadge aria-hidden="true" $accent={preset.primary}>
            <Icon name={IconName.Check} size="xs" />
          </CardCheckBadge>
        ) : null}
      </ThemeCard>
    </ThemeCardField>
  )
}

export { PresetCard }
export type { PresetCardProps }
