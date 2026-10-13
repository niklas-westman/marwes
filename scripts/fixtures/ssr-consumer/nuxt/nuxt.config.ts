export default defineNuxtConfig({
  build: { transpile: ["@marwes-ui/vue"] },
  compatibilityDate: "2026-10-13",
  css: ["@marwes-ui/presets/firstEdition/styles.css"],
  devtools: { enabled: false },
  telemetry: false,
  app: { head: { link: [{ rel: "icon", href: "/favicon.svg" }] } },
})
