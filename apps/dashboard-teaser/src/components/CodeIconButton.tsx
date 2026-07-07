import styled from "styled-components"

const StyledCodeIconButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sp24};
  right: ${({ theme }) => theme.spacing.sp24};
  width: 2rem;
  height: 1rem;

  ${({ theme }) => theme.media.mobileAndBelow} {
    top: ${({ theme }) => theme.spacing.sp16};
    right: ${({ theme }) => theme.spacing.sp16};
  }

  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, currentColor 8%, transparent);
    color: black;
  }

  &:active {
    background: color-mix(in srgb, currentColor 12%, transparent);
    color: black;
  }

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.focus};
    outline-offset: 0.125rem;
  }
`

type CodeIconButtonProps = {
  ariaLabel: string
  onClick: () => void
}

function CodeIconButton({ ariaLabel, onClick }: CodeIconButtonProps): JSX.Element {
  return (
    <StyledCodeIconButton type="button" aria-label={ariaLabel} onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    </StyledCodeIconButton>
  )
}

export { CodeIconButton }
export type { CodeIconButtonProps }
