import { resolveTone } from "@marwes-ui/core"
import type { Density, ThemeInput, ThemeMode, ToneName } from "@marwes-ui/react"
import { useState } from "react"

import {
  ControlRow,
  ControlSection,
  FontReadout,
  ModeButton,
  ModeToggle,
  RadiusValue,
  SectionLabel,
  SidebarContainer,
  SidebarHeader,
} from "./sidebar.styles"

const FONT_OPTIONS = [
  { value: "", label: "Tone default" },
  { value: "Instrument Sans, system-ui, -apple-system, sans-serif", label: "Instrument Sans" },
  { value: "Fira Code, ui-monospace, monospace", label: "Fira Code" },
  { value: "Nunito, system-ui, sans-serif", label: "Nunito" },
  { value: "Playfair Display, Georgia, serif", label: "Playfair Display" },
] as const

function toneRadius(tone: ToneName): number {
  return resolveTone(tone).ui?.radius ?? 4
}

interface SidebarProps {
  onThemeChange: (theme: ThemeInput) => void
}

function Sidebar({ onThemeChange }: SidebarProps): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>("light")
  const [primary, setPrimary] = useState("#5B8CFF")
  const [danger, setDanger] = useState("#D90429")
  const [success, setSuccess] = useState("#006633")
  const [warning, setWarning] = useState("#FFB703")
  const [radius, setRadius] = useState(4)
  const [density, setDensity] = useState<Density>("comfortable")
  const [tone, setTone] = useState<ToneName>("default")
  const [fontOverride, setFontOverride] = useState("")

  function buildTheme(overrides: {
    mode?: ThemeMode
    primary?: string
    danger?: string
    success?: string
    warning?: string
    radius?: number
    density?: Density
    tone?: ToneName
    fontOverride?: string
  }): ThemeInput {
    const m = overrides.mode ?? mode
    const t = overrides.tone ?? tone
    const p = overrides.primary ?? primary
    const d = overrides.danger ?? danger
    const s = overrides.success ?? success
    const w = overrides.warning ?? warning
    const r = overrides.radius ?? radius
    const dens = overrides.density ?? density
    const font = overrides.fontOverride ?? fontOverride

    return {
      mode: m,
      tone: t,
      color: { primary: p, danger: d, success: s, warning: w },
      ui: { radius: r, density: dens },
      ...(font ? { font: { primary: font } } : {}),
    }
  }

  function updateTone(value: ToneName): void {
    const newRadius = toneRadius(value)
    setTone(value)
    setRadius(newRadius)
    setFontOverride("")
    onThemeChange(buildTheme({ tone: value, radius: newRadius, fontOverride: "" }))
  }

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h2>Marwes</h2>
        <p>Theme playground</p>
      </SidebarHeader>

      {/* Mode */}
      <ControlSection>
        <SectionLabel>Mode</SectionLabel>
        <ModeToggle>
          <ModeButton
            type="button"
            $active={mode === "light"}
            onClick={() => {
              setMode("light")
              onThemeChange(buildTheme({ mode: "light" }))
            }}
          >
            Light
          </ModeButton>
          <ModeButton
            type="button"
            $active={mode === "dark"}
            onClick={() => {
              setMode("dark")
              onThemeChange(buildTheme({ mode: "dark" }))
            }}
          >
            Dark
          </ModeButton>
        </ModeToggle>
      </ControlSection>

      {/* Colors */}
      <ControlSection>
        <SectionLabel>Colors</SectionLabel>
        <ControlRow>
          <label htmlFor="ctrl-primary">Primary</label>
          <input
            id="ctrl-primary"
            type="color"
            value={primary}
            onChange={(e) => {
              setPrimary(e.target.value)
              onThemeChange(buildTheme({ primary: e.target.value }))
            }}
          />
        </ControlRow>
        <ControlRow>
          <label htmlFor="ctrl-danger">Danger</label>
          <input
            id="ctrl-danger"
            type="color"
            value={danger}
            onChange={(e) => {
              setDanger(e.target.value)
              onThemeChange(buildTheme({ danger: e.target.value }))
            }}
          />
        </ControlRow>
        <ControlRow>
          <label htmlFor="ctrl-success">Success</label>
          <input
            id="ctrl-success"
            type="color"
            value={success}
            onChange={(e) => {
              setSuccess(e.target.value)
              onThemeChange(buildTheme({ success: e.target.value }))
            }}
          />
        </ControlRow>
        <ControlRow>
          <label htmlFor="ctrl-warning">Warning</label>
          <input
            id="ctrl-warning"
            type="color"
            value={warning}
            onChange={(e) => {
              setWarning(e.target.value)
              onThemeChange(buildTheme({ warning: e.target.value }))
            }}
          />
        </ControlRow>
      </ControlSection>

      {/* Appearance */}
      <ControlSection>
        <SectionLabel>Appearance</SectionLabel>
        <ControlRow>
          <label htmlFor="ctrl-tone">Tone</label>
          <select
            id="ctrl-tone"
            value={tone}
            onChange={(e) => updateTone(e.target.value as ToneName)}
          >
            <option value="default">Default</option>
            <option value="digital">Digital</option>
            <option value="playful">Playful</option>
            <option value="editorial">Editorial</option>
          </select>
        </ControlRow>
        <ControlRow>
          <label htmlFor="ctrl-density">Density</label>
          <select
            id="ctrl-density"
            value={density}
            onChange={(e) => {
              const value = e.target.value as Density
              setDensity(value)
              onThemeChange(buildTheme({ density: value }))
            }}
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </ControlRow>
        <ControlRow>
          <label htmlFor="ctrl-radius">Radius</label>
          <input
            id="ctrl-radius"
            type="range"
            min={0}
            max={24}
            value={radius}
            onChange={(e) => {
              const value = Number(e.target.value)
              setRadius(value)
              onThemeChange(buildTheme({ radius: value }))
            }}
          />
          <RadiusValue>{radius}px</RadiusValue>
        </ControlRow>
      </ControlSection>

      {/* Font */}
      <ControlSection>
        <SectionLabel>Typography</SectionLabel>
        <ControlRow>
          <label htmlFor="ctrl-font">Font</label>
          <select
            id="ctrl-font"
            value={fontOverride}
            onChange={(e) => {
              setFontOverride(e.target.value)
              onThemeChange(buildTheme({ fontOverride: e.target.value }))
            }}
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </ControlRow>
        <FontReadout>
          {fontOverride ? fontOverride.split(",")[0] : `From tone (${tone})`}
        </FontReadout>
      </ControlSection>
    </SidebarContainer>
  )
}

export { Sidebar }
export type { SidebarProps }
