import type { SegmentedControlItem } from "@marwes-ui/react"

import type { Framework } from "./installation-recipes"

function ReactIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(120 12 12)"
      />
    </svg>
  )
}

function VueIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 3h4l6 10.5L18 3h4L12 22 2 3z" fill="currentColor" opacity="0.6" />
      <path d="M7 3h3.5L12 5.5 13.5 3H17l-5 8.5L7 3z" fill="currentColor" />
    </svg>
  )
}

function SvelteIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M19.1 2.4A7.4 7.4 0 0 0 9.6 3.6L5.3 6.8a5.8 5.8 0 0 0-2.5 3.9 6 6 0 0 0 .6 3.9 5.7 5.7 0 0 0-1 2.2 6.1 6.1 0 0 0 1 4.8 7.4 7.4 0 0 0 9.5 1.2l4.3-3.2a5.8 5.8 0 0 0 2.5-3.9 6 6 0 0 0-.6-3.9c.4-.7.7-1.4.9-2.2a6.1 6.1 0 0 0-1-4.8z"
        opacity="0.8"
      />
    </svg>
  )
}

const frameworkItems: SegmentedControlItem<Framework>[] = [
  { value: "react", icon: <ReactIcon />, label: "React" },
  { value: "vue", icon: <VueIcon />, label: "Vue" },
  { value: "svelte", icon: <SvelteIcon />, label: "Svelte" },
]

export { frameworkItems }
