import { CheckboxField, CheckboxGroupField } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

const mailboxOptions = [
  { value: "drafts", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sent", label: "Sent" },
]

function CheckboxShowcase(): JSX.Element {
  const [subscribed, setSubscribed] = useState(true)
  const [channels, setChannels] = useState<string[]>(["email"])
  const [selectedMailboxes, setSelectedMailboxes] = useState<string[]>(["drafts"])

  const allMailboxesSelected = selectedMailboxes.length === mailboxOptions.length
  const isMixed = selectedMailboxes.length > 0 && !allMailboxesSelected
  const selectAllOptions = [
    { value: "all", label: "Select all", indeterminate: isMixed },
    ...mailboxOptions,
  ]
  const selectAllValue = allMailboxesSelected ? ["all", ...selectedMailboxes] : selectedMailboxes

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Single field</h3>
        <p>A labeled checkbox with connected description and error wiring.</p>
        <ShowcaseStack>
          <CheckboxField
            label="Subscribe to product updates"
            description="We send at most one email per month."
            checkbox={{ checked: subscribed, onCheckedChange: setSubscribed }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Grouped choices</h3>
        <p>Related checkboxes share one fieldset label, description and error.</p>
        <ShowcaseStack>
          <CheckboxGroupField
            label="Notification channels"
            description="Choose every channel you want us to use."
            options={[
              { value: "email", label: "Email updates" },
              { value: "sms", label: "SMS alerts" },
              { value: "push", label: "Push notifications" },
            ]}
            value={channels}
            onChange={setChannels}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Indeterminate select-all</h3>
        <p>
          A parent checkbox reports a truthful mixed state while children are partially selected.
        </p>
        <ShowcaseStack>
          <CheckboxGroupField
            label="Bulk mailbox selection"
            options={selectAllOptions}
            value={selectAllValue}
            onChange={(nextValue) => {
              if (nextValue.includes("all")) {
                setSelectedMailboxes(mailboxOptions.map((option) => option.value))
                return
              }
              setSelectedMailboxes(nextValue.filter((value) => value !== "all"))
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default CheckboxShowcase
