import { DialogModal, SegmentedControlField } from "@marwes-ui/react"
import styled from "styled-components"

import { frameworkItems } from "../sections/framework-tabs"
import type { Framework } from "../sections/installation-recipes"
import { ClipboardButton } from "./ClipboardButton"
import { useFrameworkPreference } from "./FrameworkPreference"

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
  min-width: 0;
`

const CodeBlock = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sp16};
  background: rgba(0, 0, 0, 0.03);
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.text};
  height: 24rem;
  max-height: min(24rem, 60vh);
  overflow: auto;
  white-space: pre;
`

const CodeToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
`

type CodeSnippetModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  snippets: Record<Framework, string>
}

function CodeSnippetModal({
  open,
  onOpenChange,
  title,
  snippets,
}: CodeSnippetModalProps): JSX.Element {
  const { framework, setFramework } = useFrameworkPreference()

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      surfaceWidth="min(48rem, 92vw)"
      ariaLabel={`${title} code example`}
    >
      <Body>
        <SegmentedControlField
          label="Framework"
          segmentedControl={{
            items: frameworkItems,
            value: framework,
            onValueChange: setFramework,
            variant: "inverse",
            size: "md",
            fullWidth: true,
          }}
        />
        <CodeToolbar>
          <ClipboardButton value={snippets[framework]} label={`${framework} code example`} />
        </CodeToolbar>
        <CodeBlock>
          <code>{snippets[framework]}</code>
        </CodeBlock>
      </Body>
    </DialogModal>
  )
}

export { CodeSnippetModal }
export type { CodeSnippetModalProps }
