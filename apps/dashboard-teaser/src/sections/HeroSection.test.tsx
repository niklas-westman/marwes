// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { MarwesProvider } from "@marwes-ui/react"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider } from "styled-components"
import { afterEach, describe, expect, it } from "vitest"

import { HeroSection } from "./HeroSection"

describe("homepage framework selection", () => {
  afterEach(cleanup)

  it("keeps the guide, command and AI prompt aligned with the selected framework", async () => {
    const user = userEvent.setup()
    render(
      <MarwesProvider>
        {(theme) => (
          <ThemeProvider theme={theme}>
            <HeroSection />
          </ThemeProvider>
        )}
      </MarwesProvider>,
    )

    for (const framework of ["React", "Vue", "Svelte"]) {
      await user.click(screen.getByRole("radio", { name: framework }))
      const adapter = framework.toLowerCase()
      expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
        "href",
        `/docs/get-started/${adapter}/`,
      )
      expect(screen.getByRole("textbox", { name: "Existing app install command" })).toHaveValue(
        `npx @marwes-ui/cli init --adapter ${adapter}`,
      )
      const prompt = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "AI install prompt" })
      expect(prompt.value).toContain(`https://marwes.io/ai/${adapter}.md`)
    }
  })
})
