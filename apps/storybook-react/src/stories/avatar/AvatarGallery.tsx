import { Avatar, Paragraph } from "@marwes-ui/react"
import type { AvatarProps } from "@marwes-ui/react"
import type * as React from "react"

const sampleAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none"><rect width="96" height="96" rx="48" fill="#8182FC"/><circle cx="48" cy="38" r="18" fill="#F9FAFB" fill-opacity="0.94"/><path d="M22 84C25.5 67.5 36 58 48 58C60 58 70.5 67.5 74 84" fill="#F9FAFB" fill-opacity="0.94"/></svg>`
const sampleImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(sampleAvatarSvg)}`

const previews: Array<{ label: string; props: AvatarProps }> = [
  { label: "Small · Initials", props: { size: "small", initials: "MW" } },
  { label: "Small · Icon", props: { size: "small", type: "icon", ariaLabel: "User" } },
  { label: "Small · Image", props: { size: "small", src: sampleImageUrl, alt: "Sample" } },
  { label: "Medium · Initials", props: { size: "medium", initials: "MW" } },
  { label: "Medium · Icon", props: { size: "medium", type: "icon", ariaLabel: "User" } },
  { label: "Medium · Image", props: { size: "medium", src: sampleImageUrl, alt: "Sample" } },
  { label: "Large · Initials", props: { size: "large", initials: "MW" } },
  { label: "Large · Icon", props: { size: "large", type: "icon", ariaLabel: "User" } },
  { label: "Large · Image", props: { size: "large", src: sampleImageUrl, alt: "Sample" } },
]

export function AvatarGallery(): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
      }}
    >
      {previews.map((preview) => (
        <div key={preview.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Paragraph size="sm">{preview.label}</Paragraph>
          <Avatar {...preview.props} />
        </div>
      ))}
    </div>
  )
}
