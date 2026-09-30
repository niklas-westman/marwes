import { EmailField, SearchField, SelectField } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function InputShowcase(): JSX.Element {
  const [search, setSearch] = useState("")
  const [email, setEmail] = useState("katie@marwes.io")
  const [accountType, setAccountType] = useState("personal")

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Search field</h3>
        <p>Text entry with search affordance and a clear action.</p>
        <SearchField
          label="Search projects"
          input={{
            placeholder: "Search projects…",
            value: search,
            onValueChange: setSearch,
          }}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Email field</h3>
        <p>Email-specific semantics with the standard field contract.</p>
        <EmailField label="Email address" input={{ value: email, onValueChange: setEmail }} />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Select field</h3>
        <p>Choose one value from a concise set of options.</p>
        <SelectField
          label="Account type"
          select={{
            value: accountType,
            onValueChange: setAccountType,
            options: [
              { label: "Personal", value: "personal" },
              { label: "Team", value: "team" },
              { label: "Enterprise", value: "enterprise" },
            ],
          }}
        />
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default InputShowcase
