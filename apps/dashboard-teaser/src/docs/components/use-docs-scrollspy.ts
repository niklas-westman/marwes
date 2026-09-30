import { useEffect, useState } from "react"

import type { DocsSectionId } from "./component-docs-model"

interface SectionPosition {
  id: DocsSectionId
  top: number
}

interface ActiveSectionInput {
  sections: SectionPosition[]
  atDocumentEnd: boolean
}

const docsScrollOffset = 93
const docsActivationLine = docsScrollOffset + 1

function getActiveSection({
  sections,
  atDocumentEnd,
}: ActiveSectionInput): DocsSectionId | undefined {
  if (sections.length === 0) return undefined
  if (atDocumentEnd) return sections.at(-1)?.id

  let active = sections[0]?.id
  for (const section of sections) {
    if (section.top > docsActivationLine) break
    active = section.id
  }
  return active
}

function getInitialSection(sectionIds: DocsSectionId[], hash: string): DocsSectionId | undefined {
  let hashId = ""
  try {
    hashId = decodeURIComponent(hash.replace(/^#/, ""))
  } catch {
    return sectionIds[0]
  }
  return sectionIds.find((id) => id === hashId) ?? sectionIds[0]
}

function useDocsScrollspy(sectionIds: DocsSectionId[]): {
  activeSection: DocsSectionId | undefined
  selectSection: (section: DocsSectionId) => void
} {
  const [activeSection, setActiveSection] = useState<DocsSectionId | undefined>(() =>
    getInitialSection(sectionIds, typeof window === "undefined" ? "" : window.location.hash),
  )

  useEffect(() => {
    if (sectionIds.length === 0) return

    let frame: number | undefined
    const update = (): void => {
      frame = undefined
      const positions = sectionIds.flatMap((id) => {
        const element = document.getElementById(id)
        return element ? [{ id, top: element.getBoundingClientRect().top }] : []
      })
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      )
      const next = getActiveSection({
        sections: positions,
        atDocumentEnd: Math.ceil(window.scrollY + window.innerHeight) >= documentHeight - 2,
      })
      if (next) setActiveSection(next)
    }
    const scheduleUpdate = (): void => {
      if (frame !== undefined) return
      frame = window.requestAnimationFrame(update)
    }

    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate, { passive: true })
    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [sectionIds])

  return { activeSection, selectSection: setActiveSection }
}

export {
  docsActivationLine,
  docsScrollOffset,
  getActiveSection,
  getInitialSection,
  useDocsScrollspy,
}
export type { ActiveSectionInput, SectionPosition }
