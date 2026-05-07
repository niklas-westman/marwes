<script lang="ts">
  import Avatar from "./Avatar.svelte";
  import type { AvatarProps } from "./types.js";
  let props: AvatarProps = $props();
</script>
<div data-purpose="profile">
  <Avatar {...props} />
</div>
