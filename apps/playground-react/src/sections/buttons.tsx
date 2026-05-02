import {
  Button,
  CancelButton,
  CreateButton,
  DestructiveButton,
  Divider,
  IconName,
  LinkButton,
  PrimaryButton,
  SecondaryButton,
  SubmitButton,
  SuccessButton,
  TextButton,
} from "@marwes-ui/react"
import styled from "styled-components"

import { ComponentRow, PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const ButtonSizeRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`

function ButtonsSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Buttons</SectionTitle>
      <ComponentRow>
        <PrimaryButton iconLeft={IconName.Check}>Primary</PrimaryButton>
        <SecondaryButton iconLeft={IconName.Plus}>Secondary</SecondaryButton>
        <TextButton>Text</TextButton>
        <DestructiveButton iconLeft={IconName.Trash}>Delete</DestructiveButton>
      </ComponentRow>

      <Divider size="xs" />
      <SectionDescription>Sizes — xs through lg</SectionDescription>
      <ButtonSizeRow>
        <PrimaryButton size="xs">Extra Small</PrimaryButton>
        <PrimaryButton size="sm">Small</PrimaryButton>
        <PrimaryButton size="md">Medium</PrimaryButton>
        <PrimaryButton size="lg">Large</PrimaryButton>
      </ButtonSizeRow>

      <Divider size="xs" />
      <SectionDescription>States</SectionDescription>
      <ComponentRow>
        <PrimaryButton disabled>Disabled</PrimaryButton>
        <PrimaryButton loading ariaLabel="Saving" hasVisibleText>
          Loading
        </PrimaryButton>
        <Button as="a" href="#" variant="text" iconRight={IconName.ArrowRight}>
          Link button
        </Button>
      </ComponentRow>

      <Divider size="xs" />
      <SectionDescription>
        Purpose — semantic intent for accessibility and AI parsing
      </SectionDescription>
      <ComponentRow>
        <CreateButton iconLeft={IconName.Plus}>Create</CreateButton>
        <SubmitButton iconLeft={IconName.Check}>Submit</SubmitButton>
        <SuccessButton iconLeft={IconName.Check}>Approve</SuccessButton>
        <CancelButton>Cancel</CancelButton>
        <LinkButton href="#" iconRight={IconName.ArrowRight}>
          Go to docs
        </LinkButton>
      </ComponentRow>
    </PreviewSection>
  )
}

export { ButtonsSection }
