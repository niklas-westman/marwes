import {
  Badge,
  CheckboxField,
  CheckboxGroupField,
  InputOtp,
  Card as MwCard,
  Radio,
  RadioGroupField,
  SwitchField,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { CardTitle, ShowcaseCard } from "./shared"

const FirstSectionGrid = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sp24};

  > * {
    min-width: 0;
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    display: grid;
    height: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-template-columns: minmax(0, 1fr);
  }
`

const FirstSectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
  min-width: 0;

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    display: contents;
  }
`

const FirstSectionRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
  min-width: 0;

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    display: contents;
  }
`

const FirstSectionRightRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp24};
  min-width: 0;

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    display: contents;
  }
`

const FirstSectionCard = styled(ShowcaseCard)<{
  $responsiveOrder: number
}>`
  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    flex: 0 0 auto;
    width: ${(p) => p.$desktopWidth ?? "auto"};
    height: ${(p) => p.$desktopHeight ?? "auto"};
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    order: ${(p) => p.$responsiveOrder};
  }
`

const CheckboxShowcaseCard = styled(FirstSectionCard)`
  .mw-checkbox-group-field__options {
    margin-top: 0.4375rem;
  }

  .mw-checkbox-group-field__option {
    min-height: 1.5rem;
    height: 1.5rem;
  }
`

const SingleRadioField = styled.label`
  display: inline-flex;
  min-height: 1.5rem;
  padding-top: 0.1875rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};
  box-sizing: content-box;
  cursor: pointer;
  user-select: none;
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
        <FirstSectionCard
          $desktopHeight="15.125rem"
          $desktopSpan={4}
          $desktopWidth="24rem"
          $responsiveOrder={1}
        >
          <Text variant={TextVariant.overline}>Switch</Text>
          <DemoArea>
            <SwitchField label="Label" switch={{ checked: switchA, onCheckedChange: setSwitchA }} />
            <SwitchField label="Label" switch={{ checked: switchB, onCheckedChange: setSwitchB }} />
          </DemoArea>
        </FirstSectionCard>
        <FirstSectionCard
          $desktopHeight="15.625rem"
          $desktopSpan={4}
          $desktopWidth="24rem"
          $responsiveOrder={4}
        >
          <Text variant={TextVariant.overline}>Card</Text>
          <MwCard title="Card title">
            Card description text goes here. This provides more context about the card content.
          </MwCard>
        </FirstSectionCard>
      </FirstSectionColumn>
      <FirstSectionRight>
        <FirstSectionRightRow>
          <CheckboxShowcaseCard
            $desktopHeight="19.25rem"
            $desktopSpan={4}
            $desktopWidth="25rem"
            $responsiveOrder={2}
          >
            <Text variant={TextVariant.overline}>Checkbox</Text>
            <CardTitle>Size</CardTitle>
            <InlineCheckboxes>
              <CheckboxField
                label="Label"
                checkbox={{
                  checked: inlineChecks[0],
                  onCheckedChange: () => toggleInlineCheck(0),
                }}
              />
              <CheckboxField
                label="Label"
                checkbox={{
                  checked: inlineChecks[1],
                  onCheckedChange: () => toggleInlineCheck(1),
                }}
              />
              <CheckboxField
                label="Label"
                checkbox={{
                  checked: inlineChecks[2],
                  onCheckedChange: () => toggleInlineCheck(2),
                }}
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
          </CheckboxShowcaseCard>
          <FirstSectionCard
            $desktopHeight="19.25rem"
            $desktopSpan={4}
            $desktopWidth="25rem"
            $responsiveOrder={3}
          >
            <Text variant={TextVariant.overline}>Radio</Text>
            <SingleRadioField htmlFor="demo-radio-single-1">
              <Radio
                id="demo-radio-single-1"
                name="demo-radio-single"
                value="1"
                checked={radioValue === "1"}
                onCheckedChange={(checked) => {
                  if (checked) setRadioValue("1")
                }}
              />
              <Text variant={TextVariant.label}>Label</Text>
            </SingleRadioField>
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
        </FirstSectionRightRow>
        <FirstSectionRightRow>
          <OtpCard
            $desktopHeight="11.5rem"
            $desktopSpan={4}
            $desktopWidth="24rem"
            $responsiveOrder={5}
          >
            <Text variant={TextVariant.overline}>One-Time Password</Text>
            <InputOtp
              label="Verification code"
              length={6}
              helperText="Enter the 6-digit code sent to your email"
              value={otpValue}
              onValueChange={setOtpValue}
            />
          </OtpCard>
          <FirstSectionCard
            $desktopHeight="11.5rem"
            $desktopSpan={4}
            $desktopWidth="26rem"
            $responsiveOrder={6}
          >
            <Text variant={TextVariant.overline}>Badge</Text>
            <BadgeRow>
              <Badge>Badge</Badge>
              <Badge variant="info">Badge</Badge>
              <Badge variant="success">Badge</Badge>
              <Badge variant="warning">Badge</Badge>
              <Badge variant="error">Badge</Badge>
            </BadgeRow>
          </FirstSectionCard>
        </FirstSectionRightRow>
      </FirstSectionRight>
    </FirstSectionGrid>
  )
}

export { RowSwitchCard }
