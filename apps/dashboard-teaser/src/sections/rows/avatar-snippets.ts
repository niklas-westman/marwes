import type { Framework } from "../installation-recipes"

const react = `import { Avatar, AvatarBadge, AvatarGroup } from "@marwes-ui/react"

export function Example() {
  return (
    <>
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
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { Avatar, AvatarBadge, AvatarGroup } from "@marwes-ui/vue"
</script>

<template>
  <AvatarGroup
    :items="[
      { initials: 'MO' },
      { initials: 'MO' },
      { initials: 'MO' },
      { type: 'icon', label: 'Guest member' },
    ]"
    :overflow-count="3"
  />
  <AvatarBadge initials="MO" status-label="Online" />
  <Avatar src="/avatar.png" alt="User" />
  <Avatar initials="MO" size="small" />
  <Avatar type="icon" label="User icon fallback" />
</template>
`

const svelte = `<script lang="ts">
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
`

const avatarSnippets: Record<Framework, string> = { react, vue, svelte }

export { avatarSnippets }
