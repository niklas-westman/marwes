import { BadgeVariant } from "@marwes-ui/core"
import {
  Accordion,
  Badge,
  Card,
  CheckboxField,
  DestructiveButton,
  H3,
  Icon,
  IconName,
  InputField,
  Paragraph,
  PrimaryButton,
  SecondaryButton,
  Tab,
  TextButton,
  Toast,
} from "@marwes-ui/react"
import { useState } from "react"
// Atoms are no longer publicly exported; deep-import for the playground summary.
import { Radio } from "../../../../packages/react/src/components/radio/radio"
import { Switch } from "../../../../packages/react/src/components/switch/switch"

import {
  PreviewCell,
  PreviewCellLabel,
  PreviewGrid,
  PreviewHeroActions,
  PreviewHeroBody,
  PreviewIconCell,
  PreviewIconGrid,
} from "./component-summary.styles"
import { ComponentRow } from "./section.styles"

const BADGE_VARIANTS = Object.values(BadgeVariant)

const PREVIEW_ICONS: IconName[] = [
  IconName.Heart,
  IconName.Star,
  IconName.Bell,
  IconName.Settings,
  IconName.Search,
  IconName.Mail,
  IconName.User,
  IconName.Home,
  IconName.Calendar,
]

const TAB_LABELS = ["Overview", "Details", "Settings"] as const

function ComponentSummary(): JSX.Element {
  const [accordionOpen, setAccordionOpen] = useState(true)
  const [switchA, setSwitchA] = useState(false)
  const [switchB, setSwitchB] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState<"a" | "b">("a")
  const [selectedTab, setSelectedTab] = useState(1)
  const [toastVisible, setToastVisible] = useState(true)

  return (
    <PreviewGrid>
      {/* A — Hero 2×2: form with inputs, button, badge */}
      <PreviewCell $col="1 / 3" $row="1 / 3">
        <PreviewCellLabel>At a glance</PreviewCellLabel>
        <Card title="Create account">
          <PreviewHeroBody>
            <InputField label="Full name" input={{ placeholder: "Jane Doe" }} />
            <InputField label="Email" input={{ placeholder: "jane@example.com" }} />
            <PreviewHeroActions>
              <PrimaryButton>Create account</PrimaryButton>
              <Badge variant={BadgeVariant.success}>Active</Badge>
            </PreviewHeroActions>
          </PreviewHeroBody>
        </Card>
      </PreviewCell>

      {/* B — Buttons 2×1 */}
      <PreviewCell $col="3 / 5" $row="1 / 2">
        <PreviewCellLabel>Buttons</PreviewCellLabel>
        <ComponentRow>
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <DestructiveButton>Danger</DestructiveButton>
          <TextButton>Text</TextButton>
        </ComponentRow>
      </PreviewCell>

      {/* C — Typography 1×1 */}
      <PreviewCell $col="3 / 4" $row="2 / 3">
        <PreviewCellLabel>Typography</PreviewCellLabel>
        <H3>Heading</H3>
        <Paragraph size="sm">
          Body text responds to density and color theme changes instantly.
        </Paragraph>
      </PreviewCell>

      {/* D — Icons 1×1 */}
      <PreviewCell $col="4 / 5" $row="2 / 3">
        <PreviewCellLabel>Icons</PreviewCellLabel>
        <PreviewIconGrid>
          {PREVIEW_ICONS.map((name) => (
            <PreviewIconCell key={name}>
              <Icon name={name} size="sm" />
            </PreviewIconCell>
          ))}
        </PreviewIconGrid>
      </PreviewCell>

      {/* E — Badges 2×1 */}
      <PreviewCell $col="1 / 3" $row="3 / 4">
        <PreviewCellLabel>Badges</PreviewCellLabel>
        <ComponentRow>
          {BADGE_VARIANTS.map((v) => (
            <Badge key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Badge>
          ))}
        </ComponentRow>
      </PreviewCell>

      {/* F — Switch 1×1 */}
      <PreviewCell $col="3 / 4" $row="3 / 4">
        <PreviewCellLabel>Switch</PreviewCellLabel>
        <ComponentRow>
          <Switch checked={switchA} onClick={() => setSwitchA((v) => !v)}>
            {switchA ? "On" : "Off"}
          </Switch>
          <Switch checked={switchB} onClick={() => setSwitchB((v) => !v)}>
            {switchB ? "On" : "Off"}
          </Switch>
        </ComponentRow>
      </PreviewCell>

      {/* G — Checkbox + Radio 1×1 */}
      <PreviewCell $col="4 / 5" $row="3 / 4">
        <PreviewCellLabel>Selection</PreviewCellLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <CheckboxField
            label="Remember me"
            checkbox={{
              ariaLabel: "Remember me",
              checked: rememberMe,
              onCheckedChange: setRememberMe,
            }}
          />
          {(["a", "b"] as const).map((opt) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: Radio renders a native input
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <Radio
                name="preview-radio"
                ariaLabel={`Option ${opt.toUpperCase()}`}
                checked={selectedRadio === opt}
                onChange={() => setSelectedRadio(opt)}
              />
              {`Option ${opt.toUpperCase()}`}
            </label>
          ))}
        </div>
      </PreviewCell>

      {/* H — Toast 3×1 */}
      <PreviewCell $col="1 / 4" $row="4 / 5">
        <PreviewCellLabel>Toast</PreviewCellLabel>
        {toastVisible ? (
          <Toast variant="subtle" onDismiss={() => setToastVisible(false)}>
            Your changes have been saved successfully.
          </Toast>
        ) : (
          <SecondaryButton onClick={() => setToastVisible(true)}>Show toast</SecondaryButton>
        )}
      </PreviewCell>

      {/* I — Tabs 1×1 */}
      <PreviewCell $col="4 / 5" $row="4 / 5">
        <PreviewCellLabel>Tabs</PreviewCellLabel>
        <ComponentRow>
          {TAB_LABELS.map((label, i) => (
            <Tab key={label} selected={selectedTab === i} onClick={() => setSelectedTab(i)}>
              {label}
            </Tab>
          ))}
        </ComponentRow>
      </PreviewCell>

      {/* J — Accordion 2×1 */}
      <PreviewCell $col="1 / 3" $row="5 / 6">
        <PreviewCellLabel>Accordion</PreviewCellLabel>
        <Accordion
          id="summary-accordion"
          open={accordionOpen}
          onToggle={() => setAccordionOpen((v) => !v)}
          title="What is Marwes?"
        >
          A design system for building accessible, themeable UI components in React and Vue.
        </Accordion>
      </PreviewCell>

      {/* K — Card 2×1 */}
      <PreviewCell $col="3 / 5" $row="5 / 6">
        <PreviewCellLabel>Card</PreviewCellLabel>
        <Card title="Getting started">
          Install via pnpm and wrap your app with MarwesProvider to unlock full theming support.
        </Card>
      </PreviewCell>
    </PreviewGrid>
  )
}

export { ComponentSummary }
