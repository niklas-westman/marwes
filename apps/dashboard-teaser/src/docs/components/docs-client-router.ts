import { parseComponentDocsPageModel } from "./component-docs-app"
import type { ComponentDocsPageModel } from "./component-docs-model"

interface CachedDocsPage {
  model: ComponentDocsPageModel
  title: string
  description: string
  canonical: string
  scrollY?: number
}

interface DocsClientRouterOptions {
  renderModel: (model: ComponentDocsPageModel) => void
}

const pageCache = new Map<string, CachedDocsPage>()

function readHeadFrom(source: Document): { title: string; description: string; canonical: string } {
  return {
    title: source.title,
    description: source.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    canonical: source.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
  }
}

function readModelFrom(source: Document): ComponentDocsPageModel | null {
  const embedded = source.getElementById("component-docs-model")
  if (!embedded?.textContent) return null
  try {
    return parseComponentDocsPageModel(JSON.parse(embedded.textContent))
  } catch {
    return null
  }
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
  const model = readModelFrom(parsedDocument)
  if (!model) return null

  const page: CachedDocsPage = { model, ...readHeadFrom(parsedDocument) }
  pageCache.set(pathname, page)
  return page
}

function attachDocsClientRouter({ renderModel }: DocsClientRouterOptions): void {
  if (typeof window === "undefined") return

  history.scrollRestoration = "manual"
  const announcer = createRouteAnnouncer()

  const initialModel = readModelFrom(document)
  if (initialModel) {
    pageCache.set(window.location.pathname, { model: initialModel, ...readHeadFrom(document) })
  }

  async function navigate(url: URL, { push }: { push: boolean }): Promise<void> {
    const outgoingPathname = window.location.pathname
    const page = await loadPage(url.pathname, url.href)

    if (!page) {
      window.location.href = url.href
      return
    }

    if (push) {
      const outgoing = pageCache.get(outgoingPathname)
      if (outgoing) outgoing.scrollY = window.scrollY
      history.pushState({}, "", url.href)
    }

    renderModel(page.model)
    applyHead(page)
    window.scrollTo({ left: 0, top: push ? 0 : (page.scrollY ?? 0), behavior: "instant" })
    focusMainContentAndAnnounce(announcer, page.title)
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest("a[data-docs-family]")
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

export { attachDocsClientRouter }
