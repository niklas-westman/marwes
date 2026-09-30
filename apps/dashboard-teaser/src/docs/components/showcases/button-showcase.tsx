import {
  DestructiveButton,
  IconButton,
  IconName,
  LinkButton,
  PrimaryButton,
  SecondaryButton,
  SubmitButton,
} from "@marwes-ui/react"

import { ButtonRow, ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function ButtonShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Action hierarchy</h3>
        <p>Use one primary action and let secondary actions support it.</p>
        <ButtonRow>
          <PrimaryButton>Save changes</PrimaryButton>
          <SecondaryButton>Preview</SecondaryButton>
        </ButtonRow>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Explicit intent</h3>
        <p>Purpose components encode submit, navigation and destructive intent.</p>
        <ButtonRow>
          <SubmitButton>Submit</SubmitButton>
          <LinkButton href="#resources">View resources</LinkButton>
          <DestructiveButton>Delete</DestructiveButton>
        </ButtonRow>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>State and accessible naming</h3>
        <p>Loading, disabled and icon-only controls keep clear semantics.</p>
        <ButtonRow>
          <PrimaryButton loading={{ isLoading: true, loadingLabel: "Saving" }}>Save</PrimaryButton>
          <SecondaryButton disabled>Unavailable</SecondaryButton>
          <IconButton icon={IconName.Plus} ariaLabel="Create item" />
        </ButtonRow>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default ButtonShowcase
