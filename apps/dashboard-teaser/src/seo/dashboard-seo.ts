type DashboardSeoUrlOptions = {
  basePath?: string | undefined
  siteOrigin?: string | undefined
}

type DashboardSeoImage = {
  alt: string
  height: number
  path: string
  type: string
  width: number
}

type DashboardSeoLink = {
  href: string
  label: string
}

type DashboardSeoContract = {
  basePath: string
  capabilities: readonly string[]
  defaultProductionOrigin: string
  description: string
  image: DashboardSeoImage
  links: readonly DashboardSeoLink[]
  robots: string
  siteName: string
  socialDescription: string
  socialTitle: string
  title: string
}

type ResolvedDashboardSeo = DashboardSeoContract & {
  canonicalUrl: string
  imageUrl: string
}

type JsonLdObject = {
  [key: string]: JsonLdValue
}

type JsonLdValue = JsonLdObject | JsonLdValue[] | boolean | number | string

const dashboardSeo = {
  basePath: "/dashboard-teaser/latest/",
  capabilities: [
    "Framework-agnostic core with React, Vue, and Svelte adapters",
    "AI-friendly semantic component contracts",
    "Static CSS and CSS variable styling",
    "Adjustable typed themes for brand systems",
    "Theme variables for plain CSS, CSS Modules, CSS-in-JS, and Tailwind-style config",
    "Accessibility-first primitives",
  ],
  defaultProductionOrigin: "https://d3hobet9plpuvm.cloudfront.net",
  description:
    "Build AI-friendly frontend components with Marwes UI: framework-agnostic React, Vue, and Svelte adapters, static CSS, and adjustable typed themes.",
  image: {
    alt: "Marwes UI dashboard teaser showing component previews and installation controls",
    height: 1080,
    path: "assets/marwes-ui-social-preview.png",
    type: "image/png",
    width: 1920,
  },
  links: [
    { href: "https://github.com/niklas-westman/marwes/tree/main/docs", label: "Documentation" },
    { href: "https://github.com/niklas-westman/marwes", label: "GitHub" },
  ],
  robots: "index,follow,max-image-preview:large",
  siteName: "Marwes UI",
  socialDescription:
    "Framework-agnostic UI components with AI-readable contracts, static CSS, and typed theme variables for plain CSS, CSS Modules, and CSS-in-JS.",
  socialTitle: "Marwes UI | AI-friendly frontend components",
  title: "Marwes UI | AI-friendly framework-agnostic components",
} as const satisfies DashboardSeoContract

function normalizeOrigin(siteOrigin: string | undefined): string {
  const origin = siteOrigin?.trim() || dashboardSeo.defaultProductionOrigin

  return origin.replace(/\/+$/, "")
}

function normalizeBasePath(basePath: string | undefined): string {
  const path = basePath?.trim() || dashboardSeo.basePath
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`

  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`
}

function toAbsoluteUrl(path: string, options: DashboardSeoUrlOptions = {}): string {
  const origin = normalizeOrigin(options.siteOrigin)
  const basePath = normalizeBasePath(options.basePath)
  const baseUrl = new URL(basePath, `${origin}/`)
  const normalizedPath = path.replace(/^\/+/, "")

  return new URL(normalizedPath, baseUrl).toString()
}

function resolveDashboardSeo(options: DashboardSeoUrlOptions = {}): ResolvedDashboardSeo {
  const canonicalUrl = toAbsoluteUrl("", options)

  return {
    ...dashboardSeo,
    canonicalUrl,
    imageUrl: toAbsoluteUrl(dashboardSeo.image.path, options),
  }
}

function getDashboardJsonLd(seo: ResolvedDashboardSeo): readonly JsonLdObject[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: seo.siteName,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: seo.canonicalUrl,
      description: seo.description,
      softwareRequirements: ["React", "Vue", "Svelte", "Static CSS"],
      featureList: [
        "Framework-agnostic core recipes",
        "React, Vue, and Svelte adapters",
        "AI-friendly semantic component contracts",
        "Static CSS with CSS custom properties",
        "Typed adjustable theme input",
        "Theme variables for plain CSS, CSS Modules, CSS-in-JS, and Tailwind-style config",
        "Accessibility-first component primitives",
      ],
      keywords: [
        "AI-friendly frontend components",
        "AI-adapted component system",
        "framework-agnostic UI",
        "design system",
        "UI component library",
        "React components",
        "Vue components",
        "Svelte components",
        "static CSS",
        "CSS variables",
        "CSS Modules",
        "CSS-in-JS",
        "Tailwind-style theme config",
        "typed theme",
        "adjustable theme",
        "accessibility",
        "type-safe UI",
        "agent-readable components",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: seo.siteName,
      url: seo.canonicalUrl,
      description: seo.description,
    },
  ]
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function serializeJsonLd(value: JsonLdObject): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

function renderDashboardSeoHead(seo: ResolvedDashboardSeo): string {
  const escapedTitle = escapeHtml(seo.title)
  const escapedDescription = escapeHtml(seo.description)
  const escapedSocialTitle = escapeHtml(seo.socialTitle)
  const escapedSocialDescription = escapeHtml(seo.socialDescription)
  const escapedSiteName = escapeHtml(seo.siteName)
  const escapedCanonicalUrl = escapeHtml(seo.canonicalUrl)
  const escapedImageUrl = escapeHtml(seo.imageUrl)
  const escapedImageAlt = escapeHtml(seo.image.alt)
  const escapedIconUrl = escapeHtml(new URL("assets/marwes-icon.svg", seo.canonicalUrl).toString())

  return [
    `<link rel="icon" type="image/svg+xml" href="${escapedIconUrl}" />`,
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapedDescription}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
    `<link rel="canonical" href="${escapedCanonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapedSiteName}" />`,
    `<meta property="og:title" content="${escapedSocialTitle}" />`,
    `<meta property="og:description" content="${escapedSocialDescription}" />`,
    `<meta property="og:url" content="${escapedCanonicalUrl}" />`,
    `<meta property="og:image" content="${escapedImageUrl}" />`,
    `<meta property="og:image:type" content="${escapeHtml(seo.image.type)}" />`,
    `<meta property="og:image:width" content="${seo.image.width}" />`,
    `<meta property="og:image:height" content="${seo.image.height}" />`,
    `<meta property="og:image:alt" content="${escapedImageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapedSocialTitle}" />`,
    `<meta name="twitter:description" content="${escapedSocialDescription}" />`,
    `<meta name="twitter:image" content="${escapedImageUrl}" />`,
    `<meta name="twitter:image:alt" content="${escapedImageAlt}" />`,
    ...getDashboardJsonLd(seo).map(
      (item) => `<script type="application/ld+json">${serializeJsonLd(item)}</script>`,
    ),
  ].join("\n    ")
}

export {
  dashboardSeo,
  getDashboardJsonLd,
  renderDashboardSeoHead,
  resolveDashboardSeo,
  toAbsoluteUrl,
}
export type { DashboardSeoContract, DashboardSeoUrlOptions, ResolvedDashboardSeo }
