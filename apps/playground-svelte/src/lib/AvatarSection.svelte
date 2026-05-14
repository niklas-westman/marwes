<script lang="ts">
  import { Avatar, AvatarBadge, AvatarGroup } from "@marwes-ui/svelte";

  const groupItems = [
    { initials: "NW", ariaLabel: "Niklas" },
    { initials: "JD", ariaLabel: "Jane" },
    { src: "https://i.pravatar.cc/80?u=3", alt: "Alex" },
    { initials: "MK", ariaLabel: "Mike" },
  ];
</script>

<section>
  <h2 class="section-title">Avatar</h2>

  <p class="description">Sizes & types</p>
  <div class="row">
    <Avatar type="icon" size="small" ariaLabel="User" />
    <Avatar type="icon" size="medium" ariaLabel="User" />
    <Avatar type="icon" size="large" ariaLabel="User" />
    <Avatar initials="NW" ariaLabel="Niklas Westman" />
    <Avatar initials="JD" size="large" ariaLabel="Jane Doe" />
    <Avatar src="https://i.pravatar.cc/80?u=1" alt="User photo" />
    <Avatar src="https://i.pravatar.cc/80?u=2" alt="Another user" size="large" />
  </div>

  <p class="description">AvatarBadge (online indicator)</p>
  <div class="row">
    <AvatarBadge initials="NW" ariaLabel="Niklas" statusLabel="Online" />
    <AvatarBadge src="https://i.pravatar.cc/80?u=4" alt="User" size="large" />
  </div>

  <p class="description">AvatarGroup</p>
  <div class="row">
    <AvatarGroup items={groupItems} overflowCount={3} />
  </div>
</section>

<style>
  .section-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; opacity: 0.8; }
  .description { font-size: 13px; opacity: 0.6; margin: 0 0 8px; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 20px; }
</style>
