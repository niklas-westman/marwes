import { css } from "styled-components"
import type { DefaultTheme } from "styled-components"

function dashboardRadius(theme: DefaultTheme, multiplier = 3): string {
  return `calc(${theme.ui.radius} * ${multiplier})`
}

function responsiveShellPadding(theme: DefaultTheme): string {
  return `clamp(${theme.spacing.sp16}, 4vw, ${theme.spacing.sp72})`
}

const cardShellStyles = css`
  background: ${({ theme }) => theme.color.surfaceElevated};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => dashboardRadius(theme, 4)};
`

const dashboardRowStyles = css`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp24};
  width: 100%;

  ${({ theme }) => theme.media.mobileAndBelow} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sp16};
  }
`

export { cardShellStyles, dashboardRadius, dashboardRowStyles, responsiveShellPadding }
