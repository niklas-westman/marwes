import { Button, ButtonVariant, DialogModal, Paragraph, Text, TextVariant } from "@marwes-ui/react"
import styled from "styled-components"

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
`

const Option = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const OptionTag = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.primary.base};
`

const OptionTitle = styled(Text).attrs({ variant: TextVariant.label })`
  color: ${({ theme }) => theme.color.text};
`

const CodeBlock = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sp16};
  background: ${({ theme }) => theme.color.surface};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.text};
  overflow: auto;
  white-space: pre;
`

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sp16};
  flex-wrap: wrap;
`

const FooterNote = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.textMuted};
  flex: 1;
  min-width: 12rem;
`

const themeObjectSnippet = `{
  mode: "light" | "dark",
  tone: "default" | "digital",
  personality: "flat" | "glow" | "soft" | "outlined" | "print",
  color: { primary, danger, success, warning, background, surface, text, ... },
  ui: { radius: 4, density: "comfortable" },
  font: { primary: "Instrument Sans, ui-sans-serif, ..." },
}`

type ThemingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
  onOpenCustomBuilder: () => void
}

function ThemingModal({
  open,
  onOpenChange,
  onDownload,
  onOpenCustomBuilder,
}: ThemingModalProps): JSX.Element {
  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      title="Building your own theme"
      surfaceWidth="min(36rem, 92vw)"
      ariaLabel="Building your own theme"
      footer={({ close }) => (
        <FooterRow>
          <FooterNote>
            Exports the theme currently applied on this page, including any accessibility settings.
          </FooterNote>
          <Button
            variant={ButtonVariant.primary}
            onClick={() => {
              onDownload()
              close()
            }}
          >
            Download DESIGN.md
          </Button>
        </FooterRow>
      )}
    >
      <Body>
        <Option>
          <OptionTag>Option 1</OptionTag>
          <OptionTitle>Edit the Marwes theme object locally</OptionTitle>
          <Paragraph size="sm">
            Every value on this page — color, radius, font, personality — lives in one plain{" "}
            <code>ThemeInput</code> object. Copy it into your codebase, adjust the tokens, and every
            Marwes component reads from it automatically.
          </Paragraph>
          <CodeBlock>
            <code>{themeObjectSnippet}</code>
          </CodeBlock>
        </Option>

        <Option>
          <OptionTag>Option 2</OptionTag>
          <OptionTitle>Use the Custom builder</OptionTitle>
          <Paragraph size="sm">
            Prefer not to touch code first? Open the <strong>Custom</strong> preset above to adjust
            accent color, background, typeface, radius, and personality live, directly on this page.
            When it looks right, export it.
          </Paragraph>
          <div>
            <Button
              variant={ButtonVariant.secondary}
              onClick={() => {
                onOpenChange(false)
                onOpenCustomBuilder()
              }}
            >
              Open the Custom preset
            </Button>
          </div>
        </Option>
      </Body>
    </DialogModal>
  )
}

export { ThemingModal }
export type { ThemingModalProps }
