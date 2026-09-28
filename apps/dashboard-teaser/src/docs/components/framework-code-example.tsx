import type { KeyboardEvent } from "react"
import { useId, useRef, useState } from "react"
import styled from "styled-components"

import { ClipboardButton } from "../../components/ClipboardButton"
import type { DocsFramework, FrameworkDocsEntry, PublicApiExportKind } from "./component-docs-model"

const CodeCard = styled.div`
  overflow: hidden;
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp12};
  background: ${({ theme }) => theme.color.surface};
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sp4} ${({ theme }) => theme.spacing.sp8};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.borderLow};

  ${({ theme }) => theme.media.mobileAndBelow} {
    align-items: stretch;
    flex-direction: column;
  }
`

const Tabs = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  overflow-x: auto;
`

const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  min-width: 5.5rem;
  padding: ${({ theme }) => theme.spacing.sp12};
  border: 0;
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.color.primary.base : theme.color.textMuted)};
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &::after {
    position: absolute;
    right: ${({ theme }) => theme.spacing.sp4};
    bottom: -0.3125rem;
    left: ${({ theme }) => theme.spacing.sp4};
    height: 0.125rem;
    background: ${({ $active, theme }) => ($active ? theme.color.primary.base : "transparent")};
    content: "";
  }
`

const CodeCopy = styled(ClipboardButton)`
  position: relative;

  ${({ theme }) => theme.media.mobileAndBelow} {
    align-self: flex-end;
    margin: 0 ${({ theme }) => theme.spacing.sp4} ${({ theme }) => theme.spacing.sp4};
  }

  output {
    position: absolute;
    top: 100%;
    right: 0;
    width: max-content;
  }
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

const PublicApiInventory = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp16};
  margin-top: ${({ theme }) => theme.spacing.sp16};
  padding: ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const PublicApiHeading = styled.div`
  grid-column: 1 / -1;

  h3,
  p {
    margin: 0;
  }

  h3 {
    font-size: 0.75rem;
  }

  p {
    margin-top: ${({ theme }) => theme.spacing.sp2};
    color: ${({ theme }) => theme.color.textMuted};
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 0.6875rem;
  }
`

const PublicApiGroup = styled.div`
  min-width: 0;

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.sp8};
    font-size: 0.75rem;
  }

  p {
    overflow-wrap: anywhere;
    margin: 0;
    color: ${({ theme }) => theme.color.textMuted};
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 0.6875rem;
    line-height: 1.5;
  }
`

const frameworkLabel: Record<DocsFramework, string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
}

const exportKindLabel: Record<PublicApiExportKind, string> = {
  component: "Components",
  type: "Types",
  enum: "Enums",
  helper: "Helpers",
}

const exportKindOrder: PublicApiExportKind[] = ["component", "type", "enum", "helper"]

function FrameworkCodeExample({
  family,
  frameworks,
}: {
  family: string
  frameworks: FrameworkDocsEntry[]
}): JSX.Element {
  const [framework, setFramework] = useState(frameworks[0]?.framework ?? "react")
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const id = useId()
  const selectedIndex = Math.max(
    0,
    frameworks.findIndex((entry) => entry.framework === framework),
  )
  const selected = frameworks[selectedIndex]

  const selectTab = (index: number): void => {
    const entry = frameworks[index]
    if (!entry) return
    setFramework(entry.framework)
    tabRefs.current[index]?.focus()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      selectTab((selectedIndex + 1) % frameworks.length)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      selectTab((selectedIndex - 1 + frameworks.length) % frameworks.length)
    } else if (event.key === "Home") {
      event.preventDefault()
      selectTab(0)
    } else if (event.key === "End") {
      event.preventDefault()
      selectTab(frameworks.length - 1)
    }
  }

  if (!selected) return <></>

  return (
    <>
      <CodeCard>
        <Toolbar>
          <Tabs role="tablist" aria-label="Framework example">
            {frameworks.map((entry, index) => {
              const active = entry.framework === framework
              return (
                <Tab
                  key={entry.framework}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  id={`${id}-${entry.framework}-tab`}
                  type="button"
                  role="tab"
                  aria-controls={`${id}-${entry.framework}-panel`}
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  $active={active}
                  onClick={() => setFramework(entry.framework)}
                  onKeyDown={handleKeyDown}
                >
                  {frameworkLabel[entry.framework]}
                </Tab>
              )
            })}
          </Tabs>
          <CodeCopy value={selected.example} label={`${selected.framework} ${family} example`} />
        </Toolbar>
        {frameworks.map((entry) => (
          <Viewport
            key={entry.framework}
            id={`${id}-${entry.framework}-panel`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`${id}-${entry.framework}-tab`}
            hidden={entry.framework !== framework}
          >
            {entry.example.split("\n").map((line, index) => (
              <CodeLine key={`${index + 1}-${line}`}>
                <span>{index + 1}</span>
                <code>{line || " "}</code>
              </CodeLine>
            ))}
          </Viewport>
        ))}
      </CodeCard>
      <PublicApiInventory aria-label="Selected framework public API inventory">
        <PublicApiHeading>
          <h3>{frameworkLabel[selected.framework]} public API</h3>
          <p>{selected.packageName}</p>
        </PublicApiHeading>
        {exportKindOrder.map((kind) => {
          const exportsForKind = selected.exports
            .filter((entry) => entry.kind === kind)
            .map((entry) => entry.name)
          if (exportsForKind.length === 0) return null

          return (
            <PublicApiGroup key={kind}>
              <h4>{exportKindLabel[kind]}</h4>
              <p>{exportsForKind.join(", ")}</p>
            </PublicApiGroup>
          )
        })}
      </PublicApiInventory>
    </>
  )
}

export { FrameworkCodeExample }
