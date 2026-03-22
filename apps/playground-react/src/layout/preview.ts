import { H1, Paragraph } from "@marwes-ui/react"
import styled from "styled-components"

const PreviewArea = styled.main`
  padding: 48px 56px;
  overflow-y: auto;
  max-width: 960px;
`

const PreviewHeader = styled.div`
  margin-bottom: 48px;
`

const PreviewTitle = styled(H1)`
  margin: 0;
`

const PreviewSubtitle = styled(Paragraph)`
  margin: 8px 0 0;
  opacity: 0.5;
`

export { PreviewArea, PreviewHeader, PreviewSubtitle, PreviewTitle }
