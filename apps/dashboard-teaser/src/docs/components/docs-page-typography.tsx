import type { ReactNode } from "react"
import { useContext } from "react"
import styled from "styled-components"
import { DocsInlineNavigationContext } from "./docs-inline-navigation"

const HeroHeader = styled.header`
  padding-bottom: ${({ theme }) => theme.spacing.sp40};
`

function Hero({ children }: { children: ReactNode }): JSX.Element {
  const navigation = useContext(DocsInlineNavigationContext)
  return (
    <HeroHeader>
      {children}
      {navigation}
    </HeroHeader>
  )
}

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sp8};
  color: ${({ theme }) => theme.color.textBrand};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1;
`

const Lead = styled.p`
  max-width: 48rem;
  margin: ${({ theme }) => theme.spacing.sp12} 0 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 1rem;
  line-height: 1.65;
`

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.sp40};
`

const SectionHeading = styled.h2`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 650;
  letter-spacing: -0.025em;
`

const SectionDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sp4} 0
    ${({ theme }) => theme.spacing.sp16};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.8125rem;
  line-height: 1.55;
`

const Callout = styled.aside`
  margin-top: ${({ theme }) => theme.spacing.sp40};
  padding: ${({ theme }) => theme.spacing.sp24};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surfaceBrand};
  color: ${({ theme }) => theme.color.textBrand};
  font-size: 0.8125rem;
  line-height: 1.55;

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sp4};
  }
`

const PageFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sp16};
  margin-top: ${({ theme }) => theme.spacing.sp64};
  padding-top: ${({ theme }) => theme.spacing.sp24};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.75rem;

  a {
    color: ${({ theme }) => theme.color.text};
  }
`

export {
  Callout,
  Eyebrow,
  Hero,
  Lead,
  PageFooter,
  PageTitle,
  Section,
  SectionDescription,
  SectionHeading,
}
