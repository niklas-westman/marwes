import styled from "styled-components"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: ${({ theme }) => theme.breakpoint.wideDesktop}px;
  margin: 0 auto;
  width: 100%;
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
`

export { MainContent, PageWrapper }
