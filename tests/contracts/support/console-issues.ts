import { vi } from "vitest"

export interface ConsoleIssueCapture {
  issues: string[]
  stop(): string[]
}

/**
 * Hydration mismatches surface as console warnings/errors (React, Vue) or recoverable errors, so
 * contracts capture them to fail on anything the framework reports while hydrating.
 */
export function captureConsoleIssues(): ConsoleIssueCapture {
  const issues: string[] = []
  const record = (...args: unknown[]): void => {
    issues.push(args.map(String).join(" "))
  }
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(record)
  const errorSpy = vi.spyOn(console, "error").mockImplementation(record)

  return {
    issues,
    stop() {
      warnSpy.mockRestore()
      errorSpy.mockRestore()
      return issues
    },
  }
}
