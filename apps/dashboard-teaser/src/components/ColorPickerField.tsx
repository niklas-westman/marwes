import { useId } from "react"
import styled from "styled-components"

type ColorPickerFieldProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  showHexValue?: boolean
}

const ColorPickerRow = styled.div<{ $withHex: boolean }>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$withHex ? "minmax(0, 1fr) auto auto" : "minmax(0, 1fr) auto"};
  gap: ${({ theme }) => theme.spacing.sp12};
  align-items: center;
  color: ${({ theme }) => theme.color.textMuted};
`

const ColorSwatchInput = styled.input`
  width: 3rem;
  height: 1.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};
  background: transparent;
  padding: ${({ theme }) => theme.spacing.sp2};
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: ${({ theme }) => theme.spacing.sp2};
  }
`

const HexValue = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.textMuted};
  min-width: 4.5rem;
`

function ColorPickerField({
  label,
  value,
  onValueChange,
  showHexValue = false,
}: ColorPickerFieldProps): JSX.Element {
  const labelId = useId()

  return (
    <ColorPickerRow $withHex={showHexValue}>
      <span id={labelId}>{label}</span>
      <ColorSwatchInput
        type="color"
        value={value}
        aria-labelledby={labelId}
        onInput={(event) => onValueChange(event.currentTarget.value)}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {showHexValue ? <HexValue>{value.toUpperCase()}</HexValue> : null}
    </ColorPickerRow>
  )
}

export { ColorPickerField }
export type { ColorPickerFieldProps }
