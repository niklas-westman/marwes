<script setup lang="ts">
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
