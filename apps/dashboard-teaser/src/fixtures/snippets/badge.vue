<script setup lang="ts">
import { BadgeGroup, NotificationBadge, StatusBadge } from "@marwes-ui/vue"
</script>

<template>
  <BadgeGroup label="Account status">
    <StatusBadge variant="success">Active</StatusBadge>
    <NotificationBadge variant="info" aria-label="3 unread messages">3</NotificationBadge>
  </BadgeGroup>
</template>
