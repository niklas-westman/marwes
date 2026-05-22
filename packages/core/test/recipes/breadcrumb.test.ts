import { describe, expect, it } from "vitest"
import { createBreadcrumbRecipe } from "../../src/components/atoms/breadcrumb"

describe("createBreadcrumbRecipe", () => {
  it("creates a labelled breadcrumb nav with semantic data attributes", () => {
    const kit = createBreadcrumbRecipe({
      ariaLabel: "Project location",
      homeHref: "/",
      items: [
        { label: "Projects", href: "/projects" },
        { label: "Marwes", href: "/projects/marwes" },
      ],
    })

    expect(kit.tag).toBe("nav")
    expect(kit.className).toBe("mw-breadcrumb")
    expect(kit.a11y).toEqual({ ariaLabel: "Project location" })
    expect(kit.dataAttributes).toEqual({ "data-component": "breadcrumb" })
    expect(kit.list).toMatchObject({
      tag: "ol",
      className: "mw-breadcrumb__list",
      a11y: { role: "list" },
    })
    expect(kit.items[0]).toMatchObject({
      kind: "home",
      href: "/",
      a11y: { ariaLabel: "Home" },
      dataAttributes: {
        "data-component": "breadcrumb",
        "data-part": "home",
        "data-value": "home",
      },
    })
  })

  it("marks the last item as current when no explicit current item is provided", () => {
    const kit = createBreadcrumbRecipe({
      items: [{ label: "Library", href: "/library" }, { label: "Breadcrumb" }],
    })
    const current = kit.items.at(-1)

    expect(current).toMatchObject({
      label: "Breadcrumb",
      current: true,
      className: "mw-breadcrumb__item mw-breadcrumb__item--current",
      actionClassName: "mw-breadcrumb__action mw-breadcrumb__current",
      a11y: { ariaCurrent: "page" },
      dataAttributes: expect.objectContaining({
        "data-current": "true",
        "data-value": "Breadcrumb",
      }),
    })
  })

  it("respects explicit current items and can hide the home entry", () => {
    const kit = createBreadcrumbRecipe({
      showHome: false,
      items: [
        { label: "Settings", href: "/settings", current: true },
        { label: "Team", href: "/settings/team" },
      ],
    })

    expect(kit.items).toHaveLength(2)
    expect(kit.items[0]?.current).toBe(true)
    expect(kit.items[1]?.current).toBe(false)
  })
})
