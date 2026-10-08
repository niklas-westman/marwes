/**
 * Shared contract for Pagination transitions — controlled page updates and a server-rendered
 * current page surviving hydration.
 */
import { describe, expect, it } from "vitest"

export interface PaginationUpdatesProps {
  ariaLabel: string
  pageCount: number
  page?: number
  onPageChange?: (page: number) => void
}

export interface PaginationUpdatesHarness {
  render(props: PaginationUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted Pagination with new props and flushes updates. */
  rerender(props: PaginationUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: PaginationUpdatesProps): Promise<string[]>
  getCurrentPage(): HTMLElement | null
  clickPage(label: string): Promise<void>
}

const base = { ariaLabel: "Results pages", pageCount: 10 }

export function runPaginationUpdatesContract(
  adapterName: string,
  h: PaginationUpdatesHarness,
): void {
  describe(`Pagination updates contract: ${adapterName}`, () => {
    it("moves the current page on a controlled update without reporting a change", async () => {
      const changes: number[] = []
      const onPageChange = (page: number): void => {
        changes.push(page)
      }

      await h.render({ ...base, page: 2, onPageChange })
      expect(h.getCurrentPage()).toHaveTextContent("2")

      await h.rerender({ ...base, page: 5, onPageChange })

      expect(h.getCurrentPage()).toHaveTextContent("5")
      expect(changes).toEqual([])
    })

    it("keeps the server-rendered current page and stays interactive after hydration", async () => {
      const changes: number[] = []
      const issues = await h.hydrate({
        ...base,
        page: 4,
        onPageChange: (page) => changes.push(page),
      })

      expect(issues).toEqual([])
      expect(h.getCurrentPage()).toHaveTextContent("4")

      await h.clickPage("5")
      expect(changes).toEqual([5])
    })
  })
}
