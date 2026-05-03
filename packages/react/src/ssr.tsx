import type { MarwesThemeScriptOptions, MarwesThemeStyleOptions } from "@marwes-ui/core"
import {
  createMarwesThemeScript as createCoreMarwesThemeScript,
  createMarwesThemeStyle as createCoreMarwesThemeStyle,
} from "@marwes-ui/core"
import * as React from "react"

export type { MarwesThemeScriptOptions, MarwesThemeStyleOptions }

export type MarwesThemeScriptProps = MarwesThemeScriptOptions & {
  nonce?: string
}

export type MarwesThemeStyleProps = MarwesThemeStyleOptions & {
  nonce?: string
}

export function createMarwesThemeScript(options?: MarwesThemeScriptOptions): string {
  return createCoreMarwesThemeScript(options)
}

export function createMarwesThemeStyle(options?: MarwesThemeStyleOptions): string {
  return createCoreMarwesThemeStyle(options)
}

export function MarwesThemeScript({ nonce, ...options }: MarwesThemeScriptProps) {
  return (
    <script
      data-marwes-ssr-theme-script="true"
      nonce={nonce}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR helper emits deterministic Marwes-owned code before hydration.
      dangerouslySetInnerHTML={{ __html: createMarwesThemeScript(options) }}
    />
  )
}

export function MarwesThemeStyle({ nonce, ...options }: MarwesThemeStyleProps) {
  return (
    <style
      data-marwes-ssr-theme-style="true"
      nonce={nonce}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR helper emits deterministic Marwes-owned CSS before hydration.
      dangerouslySetInnerHTML={{ __html: createMarwesThemeStyle(options) }}
    />
  )
}
