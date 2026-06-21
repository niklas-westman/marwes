import { Icon, IconName } from "@marwes-ui/react"
import styled from "styled-components"

const FabRoot = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.sp24};
  right: ${({ theme }) => theme.spacing.sp24};
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};
  padding: ${({ theme }) => `${theme.spacing.sp12} ${theme.spacing.sp16}`};
  border: 0;
  border-radius: 9999px;
  background: ${({ theme }) => theme.color.primary.base};
  color: ${({ theme }) => theme.color.primary.label};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  font: inherit;
  font-weight: 500;

  &:hover {
    background: ${({ theme }) => theme.color.primary.hover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary.base};
    outline-offset: 2px;
  }
`

const FabLabel = styled.span`
  ${({ theme }) => theme.media.mobileAndBelow} {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`

type CustomizeFabProps = {
  onClick: () => void
}

function CustomizeFab({ onClick }: CustomizeFabProps): JSX.Element {
  return (
    <FabRoot type="button" onClick={onClick} aria-label="Customize playground">
      <Icon name={IconName.Sliders} decorative size={18} />
      <FabLabel>Customize</FabLabel>
    </FabRoot>
  )
}

export { CustomizeFab }
