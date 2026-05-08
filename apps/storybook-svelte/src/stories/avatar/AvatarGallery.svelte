<script lang="ts">
  import { Avatar } from "@marwes-ui/svelte"

  const sampleAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none"><rect width="96" height="96" rx="48" fill="#8182FC"/><circle cx="48" cy="38" r="18" fill="#F9FAFB" fill-opacity="0.94"/><path d="M22 84C25.5 67.5 36 58 48 58C60 58 70.5 67.5 74 84" fill="#F9FAFB" fill-opacity="0.94"/></svg>`
  const sampleImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(sampleAvatarSvg)}`

  const previews = [
    { label: "Small · Initials", props: { size: "small" as const, initials: "MW" } },
    { label: "Small · Icon", props: { size: "small" as const, type: "icon" as const, ariaLabel: "User" } },
    { label: "Small · Image", props: { size: "small" as const, src: sampleImageUrl, alt: "Sample" } },
    { label: "Medium · Initials", props: { size: "medium" as const, initials: "MW" } },
    { label: "Medium · Icon", props: { size: "medium" as const, type: "icon" as const, ariaLabel: "User" } },
    { label: "Medium · Image", props: { size: "medium" as const, src: sampleImageUrl, alt: "Sample" } },
    { label: "Large · Initials", props: { size: "large" as const, initials: "MW" } },
    { label: "Large · Icon", props: { size: "large" as const, type: "icon" as const, ariaLabel: "User" } },
    { label: "Large · Image", props: { size: "large" as const, src: sampleImageUrl, alt: "Sample" } },
  ]
</script>

<div style="display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(120px, 1fr));">
  {#each previews as preview (preview.label)}
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <span style="font-size: 12px; color: #666666;">{preview.label}</span>
      <Avatar {...preview.props} />
    </div>
  {/each}
</div>
