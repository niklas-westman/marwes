import {
  Badge,
  CheckboxField,
  CheckboxGroupField,
  InputOtp,
  Card as MwCard,
  RadioGroupField,
  SwitchField,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { CardTitle, ShowcaseCard, ShowcaseSectionLabel } from "./shared"

const FirstSectionGrid = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-template-columns: minmax(0, 1fr);
  }
`

const FirstSectionColumn = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  ${({ theme }) => theme.media.desktopAndBelow} {
    display: contents;
  }
`

const FirstSectionCard = styled(ShowcaseCard)<{
  $desktopMinHeight?: string
  $responsiveOrder: number
}>`
  ${({ theme }) => theme.media.desktopAndAbove} {
    min-height: ${(p) => p.$desktopMinHeight ?? "auto"};
  }

  ${({ theme }) => theme.media.desktopAndBelow} {
    order: ${(p) => p.$responsiveOrder};
  }
`

const DemoArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sp24};
  align-items: center;
`

const InlineCheckboxes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp16};
  flex-wrap: wrap;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => `calc(${theme.spacing.sp4} + ${theme.spacing.sp2})`};
  align-items: center;
`

const OtpCard = styled(FirstSectionCard)`
  .mw-input-otp {
    max-width: 100%;
  }

  .mw-input-otp__cells {
    width: min(100%, max-content);
  }
`

function RowSwitchCard(): JSX.Element {
  const [switchA, setSwitchA] = useState(true)
  const [switchB, setSwitchB] = useState(false)
  const [inlineChecks, setInlineChecks] = useState([false, true, true])
  const [groupValues, setGroupValues] = useState<string[]>(["1"])
  const [radioValue, setRadioValue] = useState("1")
  const [radioGroupValue, setRadioGroupValue] = useState("1")
  const [otpValue, setOtpValue] = useState("")

  const toggleInlineCheck = (index: number): void => {
    setInlineChecks((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <FirstSectionGrid>
      <FirstSectionColumn>
        <FirstSectionCard $desktopSpan={4} $desktopMinHeight="18.5rem" $responsiveOrder={1}>
          <ShowcaseSectionLabel>Switch</ShowcaseSectionLabel>
          <DemoArea>
            <SwitchField label="Label" switch={{ checked: switchA, onCheckedChange: setSwitchA }} />
            <SwitchField label="Label" switch={{ checked: switchB, onCheckedChange: setSwitchB }} />
          </DemoArea>
        </FirstSectionCard>
        <FirstSectionCard $desktopSpan={4} $desktopMinHeight="19.25rem" $responsiveOrder={4}>
          <ShowcaseSectionLabel>Card</ShowcaseSectionLabel>
          <MwCard title="Card title">
            Card description text goes here. This provides more context about the card content.
          </MwCard>
        </FirstSectionCard>
      </FirstSectionColumn>
      <FirstSectionColumn>
        <FirstSectionCard $desktopSpan={4} $desktopMinHeight="23.625rem" $responsiveOrder={2}>
          <ShowcaseSectionLabel>Checkbox</ShowcaseSectionLabel>
          <CardTitle>Size</CardTitle>
          <InlineCheckboxes>
            <CheckboxField
              label="Label"
              checkbox={{ checked: inlineChecks[0], onCheckedChange: () => toggleInlineCheck(0) }}
            />
            <CheckboxField
              label="Label"
              checkbox={{ checked: inlineChecks[1], onCheckedChange: () => toggleInlineCheck(1) }}
            />
            <CheckboxField
              label="Label"
              checkbox={{ checked: inlineChecks[2], onCheckedChange: () => toggleInlineCheck(2) }}
            />
          </InlineCheckboxes>
          <CheckboxGroupField
            label="Group label"
            description="Select all that apply"
            options={[
              { value: "1", label: "Label" },
              { value: "2", label: "Label" },
              { value: "3", label: "Label" },
            ]}
            value={groupValues}
            onChange={setGroupValues}
          />
        </FirstSectionCard>
        <OtpCard $desktopSpan={4} $desktopMinHeight="14.125rem" $responsiveOrder={5}>
          <ShowcaseSectionLabel>One-Time Password</ShowcaseSectionLabel>
          <InputOtp
            label="Verification code"
            length={6}
            helperText="Enter the 6-digit code sent to your email"
            value={otpValue}
            onValueChange={setOtpValue}
          />
        </OtpCard>
      </FirstSectionColumn>
      <FirstSectionColumn>
        <FirstSectionCard $desktopSpan={4} $desktopMinHeight="23.625rem" $responsiveOrder={3}>
          <ShowcaseSectionLabel>Radio</ShowcaseSectionLabel>
          <RadioGroupField
            name="demo-radio-single"
            label="Label"
            options={[{ value: "1", label: "Label" }]}
            value={radioValue}
            onChange={setRadioValue}
          />
          <RadioGroupField
            name="demo-radio-group"
            label="Group label"
            description="Select one option"
            options={[
              { value: "1", label: "Label" },
              { value: "2", label: "Label" },
              { value: "3", label: "Label" },
            ]}
            value={radioGroupValue}
            onChange={setRadioGroupValue}
          />
        </FirstSectionCard>
        <FirstSectionCard $desktopSpan={4} $desktopMinHeight="14.125rem" $responsiveOrder={6}>
          <ShowcaseSectionLabel>Badge</ShowcaseSectionLabel>
          <BadgeRow>
            <Badge>Badge</Badge>
            <Badge variant="info">Badge</Badge>
            <Badge variant="success">Badge</Badge>
            <Badge variant="warning">Badge</Badge>
            <Badge variant="error">Badge</Badge>
          </BadgeRow>
        </FirstSectionCard>
      </FirstSectionColumn>
    </FirstSectionGrid>
  )
}

export { RowSwitchCard }
