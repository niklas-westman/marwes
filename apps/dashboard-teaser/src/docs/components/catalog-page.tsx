import { useMemo, useState } from "react"
import styled from "styled-components"

import type { CatalogPageModel } from "./catalog-model"
import { Eyebrow, Hero, Lead, PageTitle, Section } from "./docs-page-typography"
import { siteHref } from "./docs-shell"

const SearchLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sp4};
  font-size: 0.75rem;
  font-weight: 600;
`

const SearchInput = styled.input`
  width: 100%;
  max-width: 28rem;
  padding: ${({ theme }) => theme.spacing.sp12};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  font: inherit;
  font-size: 0.875rem;

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.primary.base};
    outline-offset: 0.125rem;
  }
`

const ResultCount = styled.p`
  margin: ${({ theme }) => theme.spacing.sp8} 0 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.75rem;
`

const CatalogGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp12};
  margin: ${({ theme }) => theme.spacing.sp24} 0 0;
  padding: 0;
  list-style: none;

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const CatalogCard = styled.li`
  padding: ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surfaceElevated};
  transition: background-color 0.1s ease-out;

  &:has(h2 a:hover) {
    background: ${({ theme }) => theme.color.surfaceSubtle};
  }

  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.sp4};
    font-size: 0.9375rem;
  }

  h2 a {
    color: ${({ theme }) => theme.color.primary.base};
    text-decoration: none;
  }

  h2 a:hover {
    text-decoration: underline;
  }

  h2 a:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.primary.base};
    outline-offset: 0.125rem;
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.sp4};
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.75rem;
    line-height: 1.5;
  }

  p:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${({ theme }) => theme.color.text};
  }
`

const EmptyState = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sp24};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.8125rem;
`

function CatalogPage({ model }: { model: CatalogPageModel }): JSX.Element {
  const [query, setQuery] = useState("")

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return model.entries
    return model.entries.filter((entry) => entry.searchTerms.includes(normalizedQuery))
  }, [model.entries, query])

  return (
    <>
      <Hero>
        <Eyebrow>Marwes documentation</Eyebrow>
        <PageTitle>{model.title}</PageTitle>
        <Lead>{model.summary}</Lead>
      </Hero>

      <Section id="components" data-docs-section>
        <SearchLabel htmlFor="component-search">Family, export, or use case</SearchLabel>
        <SearchInput
          id="component-search"
          type="search"
          autoComplete="off"
          placeholder="Try email field, pagination, or icon button"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ResultCount aria-live="polite">
          {filteredEntries.length} component {filteredEntries.length === 1 ? "family" : "families"}
        </ResultCount>

        {filteredEntries.length > 0 ? (
          <CatalogGrid>
            {filteredEntries.map((entry) => (
              <CatalogCard key={entry.family}>
                <h2>
                  <a href={siteHref(`/docs/components/${entry.family}/`)} data-docs-soft-nav>
                    {entry.displayName}
                  </a>
                </h2>
                <p>{entry.summary}</p>
                <p>
                  <strong>Recommended:</strong> {entry.recommended || "See family guidance"}
                </p>
                {entry.alsoAvailable.length > 0 ? (
                  <p>
                    <strong>Also public:</strong> {entry.alsoAvailable.join(", ")}
                  </p>
                ) : null}
              </CatalogCard>
            ))}
          </CatalogGrid>
        ) : (
          <EmptyState>
            No matching component family. Try a broader use case or export name.
          </EmptyState>
        )}
      </Section>
    </>
  )
}

export { CatalogPage }
