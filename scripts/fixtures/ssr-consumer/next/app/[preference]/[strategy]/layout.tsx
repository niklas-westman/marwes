import { MarwesThemeScript, MarwesThemeStyle } from "@marwes-ui/react/ssr"
import type { ReactNode } from "react"
import "@marwes-ui/presets/firstEdition/styles.css"
export default async function Layout({
  children,
  params,
}: { children: ReactNode; params: Promise<{ preference: string; strategy: string }> }) {
  const { preference } = await params
  const defaultPreference =
    preference === "dark" ? "dark" : preference === "system" ? "system" : "light"
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
        <MarwesThemeStyle target="html" nonce="ssr-fixture" />
        <MarwesThemeScript
          target="html"
          storageKey="marwes-ssr-theme"
          defaultPreference={defaultPreference}
          nonce="ssr-fixture"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
