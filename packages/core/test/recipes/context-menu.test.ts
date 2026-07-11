import { describe, expect, it } from "vitest"
import { createContextMenuRecipe } from "../../src/components/atoms/context-menu"
import { IconName } from "../../src/components/atoms/icon"

describe("createContextMenuRecipe", () => {
  it("creates a labelled menu root with context-menu semantics", () => {
    const kit = createContextMenuRecipe({ ariaLabel: "File actions" })

    expect(kit.tag).toBe("div")
    expect(kit.className).toBe("mw-context-menu")
    expect(kit.a11y).toEqual({
      role: "menu",
      ariaLabel: "File actions",
    })
    expect(kit.dataAttributes).toEqual({
      "data-component": "context-menu",
    })
  })

  it("maps action items and dividers into render kits", () => {
    const kit = createContextMenuRecipe({
      items: [
        { value: "edit", label: "Edit", icon: IconName.Edit },
        { kind: "divider", id: "first-divider" },
        { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
      ],
    })

    expect(kit.items).toHaveLength(3)
    const editItem = kit.items[0]
    const divider = kit.items[1]
    const deleteItem = kit.items[2]

    expect(editItem).toMatchObject({
      kind: "item",
      key: "item-edit",
      label: "Edit",
      value: "edit",
      icon: IconName.Edit,
      a11y: { role: "menuitem", type: "button" },
      dataAttributes: {
        "data-component": "context-menu",
        "data-part": "item",
        "data-value": "edit",
      },
    })
    expect(divider).toMatchObject({
      kind: "divider",
      key: "first-divider",
      a11y: { role: "separator", ariaOrientation: "horizontal" },
      dataAttributes: {
        "data-component": "context-menu",
        "data-part": "divider",
      },
    })
    expect(deleteItem).toBeDefined()
    expect(deleteItem?.className).toContain("mw-context-menu__item--destructive")
    expect(deleteItem?.dataAttributes["data-destructive"]).toBe("true")
  })

  it("marks disabled action items as non-interactive", () => {
    const kit = createContextMenuRecipe({
      items: [{ value: "download", label: "Download", disabled: true }],
    })
    const item = kit.items[0]

    if (!item) {
      throw new Error("Expected disabled context-menu item")
    }

    expect(item.kind).toBe("item")
    expect(item.className).toContain("mw-context-menu__item--disabled")
    expect(item.a11y).toMatchObject({
      role: "menuitem",
      type: "button",
      disabled: true,
      ariaDisabled: "true",
    })
    expect(item.dataAttributes["data-disabled"]).toBe("true")
  })
})
