import { parseComponentDocsPageModel } from "./component-docs-app"
import type { ComponentDocsPageModel } from "./component-docs-model"
import { parseGetStartedPageModel } from "./get-started-app"
import type { GetStartedPageModel } from "./get-started-model"
import { parseIntroductionPageModel } from "./introduction-app"
import type { IntroductionPageModel } from "./introduction-model"

type DocsPage =
  | { kind: "component"; model: ComponentDocsPageModel }
  | { kind: "get-started"; model: GetStartedPageModel }
  | { kind: "introduction"; model: IntroductionPageModel }

interface CachedDocsPage {
  page: DocsPage
  title: string
  description: string
  canonical: string
  scrollY?: number
}

interface DocsClientRouterOptions {
  renderPage: (page: DocsPage) => void
}

const pageCache = new Map<string, CachedDocsPage>()

function readHeadFrom(source: Document): { title: string; description: string; canonical: string } {
  return {
    title: source.title,
    description: source.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    canonical: source.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
  }
}

function readPageFrom(source: Document): DocsPage | null {
  const componentSource = source.getElementById("component-docs-model")
  if (componentSource?.textContent) {
    try {
      return {
        kind: "component",
        model: parseComponentDocsPageModel(JSON.parse(componentSource.textContent)),
      }
    } catch {
      return null
    }
  }

  const getStartedSource = source.getElementById("get-started-model")
  if (getStartedSource?.textContent) {
    try {
      return {
        kind: "get-started",
        model: parseGetStartedPageModel(JSON.parse(getStartedSource.textContent)),
      }
    } catch {
      return null
    }
  }

  const introductionSource = source.getElementById("introduction-model")
  if (introductionSource?.textContent) {
    try {
      return {
        kind: "introduction",
        model: parseIntroductionPageModel(JSON.parse(introductionSource.textContent)),
      }
    } catch {
      return null
    }
  }

  return null
}

function applyHead(head: { title: string; description: string; canonical: string }): void {
  document.title = head.title

  let descriptionTag = document.querySelector('meta[name="description"]')
  if (!descriptionTag) {
    descriptionTag = document.createElement("meta")
    descriptionTag.setAttribute("name", "description")
    document.head.appendChild(descriptionTag)
  }
  descriptionTag.setAttribute("content", head.description)

  let canonicalTag = document.querySelector('link[rel="canonical"]')
  if (!canonicalTag) {
    canonicalTag = document.createElement("link")
    canonicalTag.setAttribute("rel", "canonical")
    document.head.appendChild(canonicalTag)
  }
  canonicalTag.setAttribute("href", head.canonical)
}

function createRouteAnnouncer(): HTMLElement {
  const element = document.createElement("div")
  element.setAttribute("role", "status")
  element.setAttribute("aria-live", "polite")
  Object.assign(element.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: "0",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
  })
  document.body.appendChild(element)
  return element
}

function focusMainContentAndAnnounce(announcer: HTMLElement, title: string): void {
  const main = document.getElementById("main-content")
  if (main) {
    main.setAttribute("tabindex", "-1")
    main.focus({ preventScroll: true })
  }
  announcer.textContent = `Navigated to ${title}`
}

async function loadPage(pathname: string, href: string): Promise<CachedDocsPage | null> {
  const cached = pageCache.get(pathname)
  if (cached) return cached

  let response: Response
  try {
    response = await fetch(href, { headers: { accept: "text/html" } })
  } catch {
    return null
  }
  if (!response.ok) return null

  const html = await response.text()
  const parsedDocument = new DOMParser().parseFromString(html, "text/html")
  const page = readPageFrom(parsedDocument)
  if (!page) return null

  const cachedPage: CachedDocsPage = { page, ...readHeadFrom(parsedDocument) }
  pageCache.set(pathname, cachedPage)
  return cachedPage
}

function attachDocsClientRouter({ renderPage }: DocsClientRouterOptions): void {
  if (typeof window === "undefined") return

  history.scrollRestoration = "manual"
  const announcer = createRouteAnnouncer()

  const initialPage = readPageFrom(document)
  if (initialPage) {
    pageCache.set(window.location.pathname, { page: initialPage, ...readHeadFrom(document) })
  }

  async function navigate(url: URL, { push }: { push: boolean }): Promise<void> {
    const outgoingPathname = window.location.pathname
    const cachedPage = await loadPage(url.pathname, url.href)

    if (!cachedPage) {
      window.location.href = url.href
      return
    }

    if (push) {
      const outgoing = pageCache.get(outgoingPathname)
      if (outgoing) outgoing.scrollY = window.scrollY
      history.pushState({}, "", url.href)
    }

    renderPage(cachedPage.page)
    applyHead(cachedPage)
    window.scrollTo({ left: 0, top: push ? 0 : (cachedPage.scrollY ?? 0), behavior: "instant" })
    focusMainContentAndAnnounce(announcer, cachedPage.title)
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest("a[data-docs-soft-nav]")
    if (!(link instanceof HTMLAnchorElement)) return
    if (link.target && link.target !== "_self") return

    let url: URL
    try {
      url = new URL(link.href, window.location.href)
    } catch {
      return
    }
    if (url.origin !== window.location.origin) return

    event.preventDefault()
    if (url.pathname === window.location.pathname) return

    void navigate(url, { push: true })
  })

  window.addEventListener("popstate", () => {
    void navigate(new URL(window.location.href), { push: false })
  })
}

export { attachDocsClientRouter, readPageFrom }
export type { DocsPage }
