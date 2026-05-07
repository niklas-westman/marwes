<script lang="ts">
  import { Icon, IconName } from "@marwes-ui/svelte";

  const showcaseIcons = [
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
  ] as const;
</script>

<section>
  <h2 class="section-title">Icons</h2>
  <p class="description">{showcaseIcons.length} of 228 available icons — hover to highlight</p>

  <div class="icon-grid">
    {#each showcaseIcons as name}
      <div class="icon-cell" title={name}>
        <Icon {name} size="sm" />
      </div>
    {/each}
  </div>
</section>

<style>
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px;
    opacity: 0.8;
  }

  .description {
    font-size: 13px;
    opacity: 0.6;
    margin: 0 0 12px;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 44px);
    gap: 8px;
  }

  .icon-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    border: 1px solid currentColor;
    opacity: 0.15;
    transition: opacity 0.15s, border-color 0.15s;
  }

  .icon-cell:hover {
    opacity: 0.5;
  }
</style>
