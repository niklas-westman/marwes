<script lang="ts">
  import { Paragraph, Tab } from "@marwes-ui/svelte"

  interface Props {
    selected?: boolean
    disabled?: boolean
    ariaLabel?: string
  }

  let { selected = true, disabled = false, ariaLabel }: Props = $props()

  const panelId = "panel-atom-tab-demo"
</script>

<div>
  <div role="tablist" aria-label="Example tab">
    <Tab
      {selected}
      {disabled}
      ariaControls={panelId}
      {...(ariaLabel ? { ariaLabel } : {})}
    >
      Tab label
    </Tab>
  </div>
  <div id={panelId} role="tabpanel" tabindex="0">
    <Paragraph>Panel content for the tab atom preview.</Paragraph>
  </div>
</div>
