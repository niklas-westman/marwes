import type { ComponentType, LazyExoticComponent } from "react"
import { Suspense, lazy } from "react"
import styled from "styled-components"

const ShowcaseFallback = styled.output`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp8};

  span {
    min-height: 8rem;
    border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
    border-radius: ${({ theme }) => theme.spacing.sp8};
    background: ${({ theme }) => theme.color.surfaceElevated};
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

function createLazyShowcase(
  family: string,
  Showcase: LazyExoticComponent<ComponentType>,
): ComponentType {
  function LazyFamilyShowcase(): JSX.Element {
    return (
      <Suspense
        fallback={
          <ShowcaseFallback aria-label={`Loading ${family} examples`}>
            <span />
            <span />
            <span />
          </ShowcaseFallback>
        }
      >
        <Showcase />
      </Suspense>
    )
  }

  return LazyFamilyShowcase
}

const showcases: Partial<Record<string, ComponentType>> = {
  accordion: createLazyShowcase(
    "accordion",
    lazy(() => import("./showcases/accordion-showcase")),
  ),
  avatar: createLazyShowcase(
    "avatar",
    lazy(() => import("./showcases/avatar-showcase")),
  ),
  badge: createLazyShowcase(
    "badge",
    lazy(() => import("./showcases/badge-showcase")),
  ),
  banner: createLazyShowcase(
    "banner",
    lazy(() => import("./showcases/banner-showcase")),
  ),
  breadcrumb: createLazyShowcase(
    "breadcrumb",
    lazy(() => import("./showcases/breadcrumb-showcase")),
  ),
  button: createLazyShowcase(
    "button",
    lazy(() => import("./showcases/button-showcase")),
  ),
  checkbox: createLazyShowcase(
    "checkbox",
    lazy(() => import("./showcases/checkbox-showcase")),
  ),
  "context-menu": createLazyShowcase(
    "context menu",
    lazy(() => import("./showcases/context-menu-showcase")),
  ),
  "date-picker": createLazyShowcase(
    "date picker",
    lazy(() => import("./showcases/date-picker-showcase")),
  ),
  dialog: createLazyShowcase(
    "dialog",
    lazy(() => import("./showcases/dialog-showcase")),
  ),
  drawer: createLazyShowcase(
    "drawer",
    lazy(() => import("./showcases/drawer-showcase")),
  ),
  heading: createLazyShowcase(
    "heading",
    lazy(() => import("./showcases/heading-showcase")),
  ),
  icon: createLazyShowcase(
    "icon",
    lazy(() => import("./showcases/icon-showcase")),
  ),
  input: createLazyShowcase(
    "input",
    lazy(() => import("./showcases/input-showcase")),
  ),
  pagination: createLazyShowcase(
    "pagination",
    lazy(() => import("./showcases/pagination-showcase")),
  ),
  paragraph: createLazyShowcase(
    "paragraph",
    lazy(() => import("./showcases/paragraph-showcase")),
  ),
  "progress-bar": createLazyShowcase(
    "progress bar",
    lazy(() => import("./showcases/progress-bar-showcase")),
  ),
  radio: createLazyShowcase(
    "radio",
    lazy(() => import("./showcases/radio-showcase")),
  ),
  "segmented-control": createLazyShowcase(
    "segmented control",
    lazy(() => import("./showcases/segmented-control-showcase")),
  ),
  skeleton: createLazyShowcase(
    "skeleton",
    lazy(() => import("./showcases/skeleton-showcase")),
  ),
  slider: createLazyShowcase(
    "slider",
    lazy(() => import("./showcases/slider-showcase")),
  ),
  spacing: createLazyShowcase(
    "spacing",
    lazy(() => import("./showcases/spacing-showcase")),
  ),
  spinner: createLazyShowcase(
    "spinner",
    lazy(() => import("./showcases/spinner-showcase")),
  ),
  "stat-tile": createLazyShowcase(
    "stat tile",
    lazy(() => import("./showcases/stat-tile-showcase")),
  ),
  switch: createLazyShowcase(
    "switch",
    lazy(() => import("./showcases/switch-showcase")),
  ),
  tab: createLazyShowcase(
    "tab",
    lazy(() => import("./showcases/tab-showcase")),
  ),
  text: createLazyShowcase(
    "text",
    lazy(() => import("./showcases/text-showcase")),
  ),
  toast: createLazyShowcase(
    "toast",
    lazy(() => import("./showcases/toast-showcase")),
  ),
  tooltip: createLazyShowcase(
    "tooltip",
    lazy(() => import("./showcases/tooltip-showcase")),
  ),
}

function getFamilyShowcase(family: string): ComponentType | undefined {
  return showcases[family]
}

export { getFamilyShowcase }
