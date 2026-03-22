import { Paragraph } from "@marwes-ui/react"
import styled from "styled-components"

const PreviewSection = styled.section`
  margin-bottom: 80px;
`

const SectionTitle = styled.p`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 20px;
  color: var(--mw-color-text);
  opacity: 0.4;
`

const SectionDescription = styled(Paragraph)`
  margin: -12px 0 24px;
`

const SectionDivider = styled.hr`
  height: 1px;
  background: var(--mw-color-text, #e4e4e7);
  opacity: 0.08;
  margin: 40px 0;
  border: none;
`

const ComponentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const ComponentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export {
  ComponentGrid,
  ComponentRow,
  ComponentStack,
  PreviewSection,
  SectionDescription,
  SectionDivider,
  SectionTitle,
}
