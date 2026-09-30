import { AvatarType, PresenceAvatar, ProfileAvatar, TeamAvatarGroup } from "@marwes-ui/react"

import { ButtonRow, ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function AvatarShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Identity fallback matrix</h3>
        <p>Image, initials, and icon fallback all resolve to the same shape and sizing.</p>
        <ButtonRow>
          <ProfileAvatar src="/assets/avatar-robot.png" alt="Mara Ortiz" size="medium" />
          <ProfileAvatar initials="MO" size="medium" />
          <ProfileAvatar type={AvatarType.icon} label="Guest member" size="medium" />
        </ButtonRow>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Presence status</h3>
        <p>A status indicator carries a truthful label, not just a colored dot.</p>
        <ButtonRow>
          <PresenceAvatar initials="MO" statusLabel="Online" />
        </ButtonRow>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Team overflow</h3>
        <p>A compact overlapping group reports how many members are hidden.</p>
        <TeamAvatarGroup
          items={[
            { initials: "MO" },
            { initials: "JS" },
            { initials: "AL" },
            { type: AvatarType.icon, label: "Guest member" },
          ]}
          overflowCount={3}
        />
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default AvatarShowcase
