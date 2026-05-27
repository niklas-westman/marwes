/**
 * CSS contract: verifies the firstEdition Input OTP stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const inputOtpCssPath = resolve(pkgDir, "src/firstEdition/input-otp.css")

describe("firstEdition input otp css contract", () => {
  it("targets text typography classes for label, helper text, and errors", () => {
    const css = readFileSync(inputOtpCssPath, "utf8")

    expect(css).toContain(".mw-input-otp__label .mw-text")
    expect(css).toContain(".mw-input-otp__helper .mw-text")
    expect(css).toContain(".mw-input-otp__error .mw-text")
    expect(css).not.toContain(".mw-input-otp__label .mw-p")
    expect(css).not.toContain(".mw-input-otp__helper .mw-p")
    expect(css).not.toContain(".mw-input-otp__error .mw-p")
  })
})
