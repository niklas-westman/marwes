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

import { CardTitle, FlexCard } from "./shared"

const RowContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 384px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`

const TopRow = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const BottomRow = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const DemoArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InlineCheckboxes = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
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
    <RowContainer>
      {/* Left column: Switch + Card (384px) */}
      <LeftColumn>
        <FlexCard>
          <SectionLabel>Switch</SectionLabel>
          <DemoArea>
            <SwitchField label="Label" switch={{ checked: switchA, onCheckedChange: setSwitchA }} />
            <SwitchField label="Label" switch={{ checked: switchB, onCheckedChange: setSwitchB }} />
          </DemoArea>
        </FlexCard>
        <FlexCard>
          <SectionLabel>Card</SectionLabel>
          <MwCard title="Card title">
            Card description text goes here. This provides more context about the card content.
          </MwCard>
        </FlexCard>
      </LeftColumn>

      {/* Right column: (Checkbox | Radio) over (OTP | Badge) */}
      <RightColumn>
        <TopRow>
          <FlexCard>
            <SectionLabel>Checkbox</SectionLabel>
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
          </FlexCard>
          <FlexCard>
            <SectionLabel>Radio</SectionLabel>
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
          </FlexCard>
        </TopRow>
        <BottomRow>
          <FlexCard>
            <SectionLabel>One-Time Password</SectionLabel>
            <InputOtp
              label="Verification code"
              length={6}
              helperText="Enter the 6-digit code sent to your email"
              value={otpValue}
              onValueChange={setOtpValue}
            />
          </FlexCard>
          <FlexCard>
            <SectionLabel>Badge</SectionLabel>
            <BadgeRow>
              <Badge>Badge</Badge>
              <Badge variant="info">Badge</Badge>
              <Badge variant="success">Badge</Badge>
              <Badge variant="warning">Badge</Badge>
              <Badge variant="error">Badge</Badge>
            </BadgeRow>
          </FlexCard>
        </BottomRow>
      </RightColumn>
    </RowContainer>
  )
}

export { RowSwitchCard }
