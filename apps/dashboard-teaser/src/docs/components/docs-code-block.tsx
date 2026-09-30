import styled from "styled-components"

import { ClipboardButton } from "../../components/ClipboardButton"

const CodeCard = styled.div`
  overflow: hidden;
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surface};
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sp4} ${({ theme }) => theme.spacing.sp8};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
`

const Viewport = styled.div`
  max-width: 100%;
  max-height: 22rem;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.sp16} 0;
`

const CodeLine = styled.div`
  display: grid;
  grid-template-columns: 2.5rem minmax(max-content, 1fr);
  min-height: 1.35rem;
  padding-right: ${({ theme }) => theme.spacing.sp16};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: pre;

  span {
    padding-right: ${({ theme }) => theme.spacing.sp12};
    color: ${({ theme }) => theme.color.textSubtle};
    text-align: right;
    user-select: none;
  }
`

function DocsCodeBlock({ code, label }: { code: string; label: string }): JSX.Element {
  return (
    <CodeCard>
      <Toolbar>
        <ClipboardButton value={code} label={label} />
      </Toolbar>
      <Viewport>
        {code.split("\n").map((line, index) => (
          <CodeLine key={`${index + 1}-${line}`}>
            <span>{index + 1}</span>
            <code>{line || " "}</code>
          </CodeLine>
        ))}
      </Viewport>
    </CodeCard>
  )
}

export { DocsCodeBlock }
