import { Icon, IconName } from "@marwes-ui/react"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import styled from "styled-components"

import { type GoogleFontEntry, googleFontRegistry } from "../sections/google-fonts-registry"
import { registerFontCategories, resolveFontStack } from "../sections/playground-fonts"

registerFontCategories(googleFontRegistry)

/**
 * Curated fast-path — these families always appear at the top of the picker
 * and pre-render in their own font so the visitor immediately understands the
 * picker as a live preview. All 8 are in Google Fonts' most-installed set.
 */
const FEATURED_FAMILIES = [
  "Inter",
  "Roboto",
  "DM Sans",
  "Instrument Sans",
  "Playfair Display",
  "Lora",
  "Fira Code",
  "JetBrains Mono",
] as const

function buildFeaturedFontsLink(): string {
  const params = FEATURED_FAMILIES.map(
    (family) => `family=${encodeURIComponent(family).replace(/%20/g, "+")}`,
  ).join("&")
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

function usePreloadFeaturedFonts(): void {
  useEffect(() => {
    const href = buildFeaturedFontsLink()
    if (document.querySelector(`link[data-font-combobox-featured="true"]`)) return
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.dataset.fontComboboxFeatured = "true"
    document.head.appendChild(link)
  }, [])
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
  min-width: 0;
`

const SearchRow = styled.div`
  position: relative;
`

const SearchIconSlot = styled.span`
  position: absolute;
  top: 50%;
  left: ${({ theme }) => theme.spacing.sp8};
  transform: translateY(-50%);
  color: ${({ theme }) => theme.color.textMuted};
  pointer-events: none;
  display: inline-flex;
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sp8} ${theme.spacing.sp8}`};
  padding-left: ${({ theme }) => theme.spacing.sp32};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.text};
  font: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.color.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`

const ListScroller = styled.div`
  max-height: 22rem;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};
  background: ${({ theme }) => theme.color.surface};
`

const GroupLabel = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sp8} ${theme.spacing.sp12} ${theme.spacing.sp4}`};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`

const OptionButton = styled.button<{ $active: boolean; $selected: boolean; $preview?: string }>`
  appearance: none;
  border: 0;
  background: ${({ $active, theme }) => ($active ? theme.color.surfaceElevated : "transparent")};
  color: ${({ theme }) => theme.color.text};
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing.sp8} ${theme.spacing.sp12}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sp8};
  cursor: pointer;
  font: inherit;
  ${({ $preview }) => ($preview ? `font-family: ${$preview};` : "")}
  ${({ $selected, theme }) => ($selected ? `color: ${theme.color.primary};` : "")}

  &:hover {
    background: ${({ theme }) => theme.color.surfaceElevated};
  }
`

const OptionCheck = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.color.primary};
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.sp16};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.8125rem;
`

const featuredSet = new Set<string>(FEATURED_FAMILIES)
const OPTION_BATCH_SIZE = 80
const LOAD_MORE_THRESHOLD_PX = 200

type ComboOption = {
  family: string
  category: string
  isFeatured: boolean
}

function useFilteredOptions(query: string): {
  featured: ComboOption[]
  all: ComboOption[]
} {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const featured: ComboOption[] = FEATURED_FAMILIES.map((family) => {
      const meta = googleFontRegistry.find((entry) => entry.family === family)
      return {
        family,
        category: meta?.category ?? "sans-serif",
        isFeatured: true,
      }
    })

    const all: ComboOption[] = googleFontRegistry
      .filter((entry): entry is GoogleFontEntry => !featuredSet.has(entry.family))
      .map((entry) => ({
        family: entry.family,
        category: entry.category,
        isFeatured: false,
      }))

    if (!normalizedQuery) {
      return { featured, all }
    }

    const matches = (candidate: ComboOption) =>
      candidate.family.toLowerCase().includes(normalizedQuery)

    return {
      featured: featured.filter(matches),
      all: all.filter(matches),
    }
  }, [query])
}

type GoogleFontComboboxProps = {
  value: string
  onSelect: (family: string) => void
}

function GoogleFontCombobox({ value, onSelect }: GoogleFontComboboxProps): JSX.Element {
  usePreloadFeaturedFonts()
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(OPTION_BATCH_SIZE)
  const listboxId = useId()
  const listRef = useRef<HTMLDivElement | null>(null)

  const { featured, all } = useFilteredOptions(query)
  const flatOptions = useMemo(() => [...featured, ...all], [featured, all])
  const visibleOptions = flatOptions.slice(0, visibleCount)
  const visibleFeatured = visibleOptions.filter((option) => option.isFeatured)
  const visibleAll = visibleOptions.filter((option) => !option.isFeatured)
  const totalCount = googleFontRegistry.length

  useEffect(() => {
    // Scroll the active row into view when navigating with arrow keys.
    const node = listRef.current?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)
    node?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const commitSelection = (index: number): void => {
    const option = flatOptions[index]
    if (option) onSelect(option.family)
  }

  const ensureVisible = (index: number): void => {
    setVisibleCount((current) => {
      if (index < current) return current
      const nextBatchEnd = Math.ceil((index + 1) / OPTION_BATCH_SIZE) * OPTION_BATCH_SIZE
      return Math.min(flatOptions.length, nextBatchEnd)
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (flatOptions.length === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => {
        const next = Math.min(current + 1, flatOptions.length - 1)
        ensureVisible(next)
        return next
      })
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === "Home") {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === "End") {
      event.preventDefault()
      const lastIndex = flatOptions.length - 1
      ensureVisible(lastIndex)
      setActiveIndex(lastIndex)
    } else if (event.key === "Enter") {
      event.preventDefault()
      commitSelection(activeIndex)
    }
  }

  const renderOption = (option: ComboOption, index: number): JSX.Element => {
    const selected = option.family === value
    const active = index === activeIndex
    const preview = option.isFeatured ? resolveFontStack(option.family) : undefined
    const optionId = `${listboxId}-option-${index}`

    return (
      <OptionButton
        key={option.family}
        id={optionId}
        type="button"
        // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA combobox pattern requires role="option" on a button, not a native <option>.
        role="option"
        aria-selected={selected}
        aria-posinset={index + 1}
        aria-setsize={flatOptions.length}
        tabIndex={-1}
        data-option-index={index}
        $active={active}
        $selected={selected}
        $preview={preview}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(option.family)}
      >
        <span>{option.family}</span>
        {selected ? (
          <OptionCheck aria-hidden="true">
            <Icon name={IconName.Check} size="xs" />
          </OptionCheck>
        ) : null}
      </OptionButton>
    )
  }

  const activeDescendantId =
    flatOptions.length > 0 ? `${listboxId}-option-${activeIndex}` : undefined

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value)
    setActiveIndex(0)
    setVisibleCount(OPTION_BATCH_SIZE)
  }

  const handleListScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    const list = event.currentTarget
    const distanceFromEnd = list.scrollHeight - list.scrollTop - list.clientHeight
    if (distanceFromEnd > LOAD_MORE_THRESHOLD_PX) return

    setVisibleCount((current) => Math.min(flatOptions.length, current + OPTION_BATCH_SIZE))
  }

  return (
    <Wrapper>
      <SearchRow>
        <SearchIconSlot aria-hidden="true">
          <Icon name={IconName.Search} size="sm" />
        </SearchIconSlot>
        <SearchInput
          type="text"
          role="combobox"
          aria-label="Font family"
          aria-controls={listboxId}
          aria-expanded="true"
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
          placeholder={`Search ${totalCount.toLocaleString()} Google Fonts…`}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
        />
      </SearchRow>
      {/* biome-ignore lint/a11y/useSemanticElements: WAI-ARIA combobox pattern uses a scrollable div with role="listbox", not a native <select>. */}
      <ListScroller ref={listRef} id={listboxId} role="listbox" onScroll={handleListScroll}>
        {visibleFeatured.length > 0 ? (
          <>
            <GroupLabel aria-hidden="true">Featured</GroupLabel>
            {visibleFeatured.map((option, index) => renderOption(option, index))}
          </>
        ) : null}
        {visibleAll.length > 0 ? (
          <>
            <GroupLabel aria-hidden="true">All Google Fonts</GroupLabel>
            {visibleAll.map((option, offset) =>
              renderOption(option, visibleFeatured.length + offset),
            )}
          </>
        ) : null}
        {flatOptions.length === 0 ? (
          <EmptyState>No families match &ldquo;{query}&rdquo;.</EmptyState>
        ) : null}
      </ListScroller>
    </Wrapper>
  )
}

export { GoogleFontCombobox }
export type { GoogleFontComboboxProps }
