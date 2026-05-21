import styled from "styled-components"

const FooterContainer = styled.footer`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 80px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`

const FooterText = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--mw-color-text, #141414);
`

function Footer(): JSX.Element {
  return (
    <FooterContainer>
      <FooterText>Marwes — /mɑːr.wɛz/</FooterText>
    </FooterContainer>
  )
}

export { Footer }
