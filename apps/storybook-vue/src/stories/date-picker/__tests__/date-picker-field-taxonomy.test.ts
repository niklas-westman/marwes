import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue date-picker-field story taxonomy", () => {
  it("uses Molecule title for DatePickerField story", () => {
    expect(readStoryFile("date-picker-field.stories.ts")).toContain(
      'title: "DatePicker/Molecule/DatePickerField"',
    )
  })
})
