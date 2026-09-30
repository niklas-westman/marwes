<script lang="ts">
  import { Avatar, AvatarBadge, AvatarGroup } from "@marwes-ui/svelte"
</script>

<AvatarGroup
  items={[
    { initials: "MO" },
    { initials: "MO" },
    { initials: "MO" },
    { type: "icon", label: "Guest member" },
  ]}
  overflowCount={3}
/>
<AvatarBadge initials="MO" statusLabel="Online" />
<Avatar src="/avatar.png" alt="User" />
<Avatar initials="MO" size="small" />
<Avatar type="icon" label="User icon fallback" />
