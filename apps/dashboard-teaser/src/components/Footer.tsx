import { Text, TextVariant } from "@marwes-ui/react"
import styled from "styled-components"

const FooterContainer = styled.footer`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sp48};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.sp80};

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: 0 ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
  }
`

const FooterText = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.text};
`

function Footer(): JSX.Element {
  return (
    <FooterContainer>
      <FooterText>Marwes — /mɑːr.wɛz/</FooterText>
    </FooterContainer>
  )
}

export { Footer }
