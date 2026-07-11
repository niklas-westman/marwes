/**
 * React Input story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React input story taxonomy", () => {
  it("uses Atom title for Input story", () => {
    const inputStory = readStoryFile("input.stories.tsx")

    expect(inputStory).toContain('title: "Input/Atom/Input"')
    expect(inputStory).toContain("component: Input")
    expect(inputStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Atom title for Textarea story", () => {
    const textareaStory = readStoryFile("textarea.stories.tsx")

    expect(textareaStory).toContain('title: "Input/Atom/Textarea"')
    expect(textareaStory).toContain("component: Textarea")
    expect(textareaStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Atom title for RichText story", () => {
    const richTextStory = readStoryFile("rich-text.stories.tsx")

    expect(richTextStory).toContain('title: "Input/Atom/RichText"')
    expect(richTextStory).toContain("component: RichText")
    expect(richTextStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Atom title for Select story", () => {
    const selectStory = readStoryFile("select.stories.tsx")

    expect(selectStory).toContain('title: "Input/Atom/Select"')
    expect(selectStory).toContain("component: Select")
    expect(selectStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Molecule title for bare InputOtp story", () => {
    const inputOtpStory = readStoryFile("input-otp.stories.tsx")

    expect(inputOtpStory).toContain('title: "Input/Molecule/InputOtp"')
    expect(inputOtpStory).toContain("component: InputOtp")
    expect(inputOtpStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Molecule title for InputOtpField story", () => {
    const inputOtpFieldStory = readStoryFile("input-otp-field.stories.tsx")

    expect(inputOtpFieldStory).toContain('title: "Input/Molecule/InputOtpField"')
    expect(inputOtpFieldStory).toContain("component: InputOtpField")
  })

  it("uses Molecule title for InputField story", () => {
    const inputFieldStory = readStoryFile("input-field.stories.tsx")

    expect(inputFieldStory).toContain('title: "Input/Molecule/InputField"')
  })

  it("uses Molecule title for TextareaField story", () => {
    const textareaFieldStory = readStoryFile("textarea-field.stories.tsx")

    expect(textareaFieldStory).toContain('title: "Input/Molecule/TextareaField"')
  })

  it("uses Molecule title for RichTextField story", () => {
    const richTextFieldStory = readStoryFile("rich-text-field.stories.tsx")

    expect(richTextFieldStory).toContain('title: "Input/Molecule/RichTextField"')
  })

  it("uses Molecule title for SelectField story", () => {
    const selectFieldStory = readStoryFile("select-field.stories.tsx")

    expect(selectFieldStory).toContain('title: "Input/Molecule/SelectField"')
  })

  it("keeps purpose stories under Input/Purpose", () => {
    const purposeStories = [
      "dropdown-field.stories.tsx",
      "search-field.stories.tsx",
      "password-field.stories.tsx",
      "email-field.stories.tsx",
      "date-of-birth-field.stories.tsx",
      "zip-code-field.stories.tsx",
      "phone-field.stories.tsx",
      "url-field.stories.tsx",
      "currency-field.stories.tsx",
    ]

    for (const storyName of purposeStories) {
      const content = readStoryFile(storyName)

      expect(content).toMatch(/title:\s*"Input\/Purpose\/[A-Za-z]+"/)
      expect(content).not.toContain('title: "Input/General/')
    }
  })
})
