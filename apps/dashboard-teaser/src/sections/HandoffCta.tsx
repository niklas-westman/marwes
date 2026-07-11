import { Button, ButtonVariant, IconName, Paragraph, Text, TextVariant } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { ThemingModal } from "../components/ThemingModal"
import { downloadDesignFile, generateDesignMd } from "./design-md-export"
import type { PlaygroundSettings } from "./playground-settings"
import type { ThemePreset } from "./theme-presets"

const CtaSection = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sp80}
    ${({ theme }) => theme.spacing.sp80} ${({ theme }) => theme.spacing.sp48};
  display: flex;
  align-items: center;
  min-height: ${({ theme }) => `calc(100svh - (${theme.spacing.sp64} + ${theme.spacing.sp4}))`};

  ${({ theme }) => theme.media.desktopAndBelow} {
    padding: ${({ theme }) => `calc(${theme.spacing.sp56} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp40} ${({ theme }) => theme.spacing.sp40};
    align-items: flex-start;
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp40}
      ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`}
      ${({ theme }) => theme.spacing.sp32};
  }
`

const CtaInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
  width: 100%;
`

const Eyebrow = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.textMuted};
`

const CtaTitle = styled(Text).attrs({
  variant: TextVariant.display,
  headingLevel: 2,
})`
  max-width: 40rem;

  em {
    color: ${({ theme }) => theme.color.primary.base};
    font-style: normal;
  }
`

const CtaText = styled(Paragraph)`
  max-width: 34rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp24};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sp16};

  ${({ theme }) => theme.media.mobileAndBelow} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sp16};
  }
`

type HandoffCtaProps = {
  settings: PlaygroundSettings
  preset: ThemePreset
  onOpenCustomBuilder: () => void
}

function HandoffCta({ settings, preset, onOpenCustomBuilder }: HandoffCtaProps): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDownload = (): void => {
    const content = generateDesignMd({ settings, preset })
    downloadDesignFile(content)
  }

  return (
    <CtaSection id="handoff" data-dashboard-section="handoff">
      <CtaInner>
        <Eyebrow>Ready to hand off</Eyebrow>
        <CtaTitle>
          Export <em>{preset.name}</em> as DESIGN.md
        </CtaTitle>
        <CtaText size="md">
          Includes every color, radius, and font token for the theme you're currently viewing — plus
          any accessibility settings you've turned on above. Follows the Google Labs DESIGN.md
          format so any coding agent can pick it up.
        </CtaText>
        <Actions>
          <Button
            variant={ButtonVariant.primary}
            iconRight={IconName.Download}
            onClick={handleDownload}
          >
            Download DESIGN.md
          </Button>
          <Button
            variant={ButtonVariant.text}
            iconRight={IconName.ArrowUpRight}
            onClick={() => setModalOpen(true)}
          >
            Read more about theming
          </Button>
        </Actions>
      </CtaInner>
      <ThemingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onDownload={handleDownload}
        onOpenCustomBuilder={onOpenCustomBuilder}
      />
    </CtaSection>
  )
}

export { HandoffCta }
export type { HandoffCtaProps }
