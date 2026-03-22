import { Icon, IconName } from "@marwes-ui/react"
import styled from "styled-components"

import { PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const SHOWCASE_ICONS: IconName[] = [
  IconName.Heart,
  IconName.Star,
  IconName.Bell,
  IconName.Settings,
  IconName.Search,
  IconName.Mail,
  IconName.User,
  IconName.Home,
  IconName.Calendar,
  IconName.Camera,
  IconName.Clock,
  IconName.Compass,
  IconName.Code,
  IconName.Command,
  IconName.Copy,
  IconName.Download,
  IconName.Edit,
  IconName.Eye,
  IconName.File,
  IconName.Folder,
  IconName.Flag,
  IconName.Grid,
  IconName.Image,
  IconName.Info,
  IconName.Inbox,
  IconName.Layout,
  IconName.Link,
  IconName.Lock,
  IconName.MapMarker1,
  IconName.Menu,
  IconName.Monitor,
  IconName.Moon,
  IconName.Music,
  IconName.Paperclip,
  IconName.Phone,
  IconName.Printer,
  IconName.Save,
  IconName.Share,
  IconName.Sun,
  IconName.Tag,
  IconName.Trash,
  IconName.Tv,
  IconName.Upload,
  IconName.Wifi,
  IconName.Power,
]

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 44px);
  gap: 8px;
`

const IconCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--mw-color-text, #e4e4e7);
  opacity: 0.15;
  transition: opacity 0.15s, border-color 0.15s;

  &:hover {
    opacity: 0.5;
    border-color: var(--mw-color-primary-base, #3b82f6);
  }
`

function IconsSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Icons</SectionTitle>
      <SectionDescription>
        {SHOWCASE_ICONS.length} of 228 available icons — hover to highlight
      </SectionDescription>
      <IconGrid>
        {SHOWCASE_ICONS.map((name) => (
          <IconCell key={name} title={name}>
            <Icon name={name} size="sm" />
          </IconCell>
        ))}
      </IconGrid>
    </PreviewSection>
  )
}

export { IconsSection }
