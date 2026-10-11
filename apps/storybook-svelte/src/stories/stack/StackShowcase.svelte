<script lang="ts">
  import {
    Paragraph,
    Stack,
    StackItem,
    stackAlignItemsValues,
    stackDirections,
    stackJustifyContentValues,
  } from "@marwes-ui/svelte"
  import type { StackItemProps, StackProps } from "@marwes-ui/svelte"

  interface Props {
    showcase:
      | "default"
      | "directions"
      | "gap"
      | "padding"
      | "alignment"
      | "justify"
      | "wrap"
      | "child-sizing"
      | "nested"
      | "item"
      | "list-items"
    stackProps?: StackProps
    itemProps?: StackItemProps
  }

  const { showcase, stackProps = {}, itemProps = {} }: Props = $props()

  // Demo-only chrome: the outline and tint make the stack's padding and gaps visible.
  const frameStyle =
    "width: 520px; border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.6);"
  const boxStyle = "padding: 8px 12px; border-radius: 8px; background: rgba(14, 165, 233, 0.16);"
  const gaps = ["sp-4", "sp-16", "sp-32"] as const
  const wrapLabels = ["Design", "Research", "Frontend", "Backend", "Data", "Platform"]
  const steps = ["Draft", "Review", "Publish"]
</script>

{#snippet threeItems()}
  <StackItem><div style={boxStyle}>One</div></StackItem>
  <StackItem><div style={`${boxStyle} min-height: 56px;`}>Two</div></StackItem>
  <StackItem><div style={boxStyle}>Three</div></StackItem>
{/snippet}

{#if showcase === "default"}
  <div style={frameStyle}>
    <Stack {...stackProps}>{@render threeItems()}</Stack>
  </div>
{:else if showcase === "directions"}
  <Stack gap="sp-24">
    {#each stackDirections as direction (direction)}
      <StackItem>
        <Paragraph>direction="{direction}"</Paragraph>
        <div style={frameStyle}>
          <Stack {direction} gap="sp-12" padding="sp-12">{@render threeItems()}</Stack>
        </div>
      </StackItem>
    {/each}
  </Stack>
{:else if showcase === "gap"}
  <Stack gap="sp-24">
    {#each gaps as gap (gap)}
      <StackItem>
        <Paragraph>gap="{gap}"</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" {gap} padding="sp-12">{@render threeItems()}</Stack>
        </div>
      </StackItem>
    {/each}
  </Stack>
{:else if showcase === "padding"}
  <Stack gap="sp-24">
    <StackItem>
      <Paragraph>padding="sp-32"</Paragraph>
      <div style={frameStyle}>
        <Stack direction="row" gap="sp-12" padding="sp-32">{@render threeItems()}</Stack>
      </div>
    </StackItem>
    <StackItem>
      <Paragraph>paddingX="sp-48" paddingY="sp-8"</Paragraph>
      <div style={frameStyle}>
        <Stack direction="row" gap="sp-12" paddingX="sp-48" paddingY="sp-8">
          {@render threeItems()}
        </Stack>
      </div>
    </StackItem>
    <StackItem>
      <Paragraph>padding="sp-8" paddingLeft="sp-48"</Paragraph>
      <div style={frameStyle}>
        <Stack direction="row" gap="sp-12" padding="sp-8" paddingLeft="sp-48">
          {@render threeItems()}
        </Stack>
      </div>
    </StackItem>
  </Stack>
{:else if showcase === "alignment"}
  <Stack gap="sp-24">
    {#each stackAlignItemsValues as alignItems (alignItems)}
      <StackItem>
        <Paragraph>alignItems="{alignItems}"</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" gap="sp-12" padding="sp-12" {alignItems}>
            {@render threeItems()}
          </Stack>
        </div>
      </StackItem>
    {/each}
  </Stack>
{:else if showcase === "justify"}
  <Stack gap="sp-24">
    {#each stackJustifyContentValues as justifyContent (justifyContent)}
      <StackItem>
        <Paragraph>justifyContent="{justifyContent}"</Paragraph>
        <div style={frameStyle}>
          <Stack direction="row" gap="sp-12" padding="sp-12" {justifyContent}>
            {@render threeItems()}
          </Stack>
        </div>
      </StackItem>
    {/each}
  </Stack>
{:else if showcase === "wrap"}
  <div style={`${frameStyle} width: 280px;`}>
    <Stack direction="row" wrap="wrap" rowGap="sp-8" columnGap="sp-12" padding="sp-12">
      {#each wrapLabels as label (label)}
        <StackItem><div style={boxStyle}>{label}</div></StackItem>
      {/each}
    </Stack>
  </div>
{:else if showcase === "child-sizing"}
  <Stack gap="sp-24">
    <StackItem>
      <Paragraph>Row parent</Paragraph>
      <div style={frameStyle}>
        <Stack direction="row" gap="sp-12" padding="sp-12">
          <StackItem horizontalSizing="fix" verticalSizing="fix">
            <div style={`${boxStyle} width: 72px; height: 96px;`}>fix</div>
          </StackItem>
          <StackItem><div style={boxStyle}>hug</div></StackItem>
          <StackItem horizontalSizing="fill" verticalSizing="fill">
            <div style={boxStyle}>fill / fill</div>
          </StackItem>
        </Stack>
      </div>
    </StackItem>
    <StackItem>
      <Paragraph>Column parent</Paragraph>
      <div style={frameStyle}>
        <Stack direction="column" gap="sp-12" padding="sp-12">
          <StackItem><div style={boxStyle}>hug</div></StackItem>
          <StackItem horizontalSizing="fill"><div style={boxStyle}>horizontal fill</div></StackItem>
          <StackItem horizontalSizing="fix">
            <div style={`${boxStyle} width: 160px;`}>fix</div>
          </StackItem>
        </Stack>
      </div>
    </StackItem>
  </Stack>
{:else if showcase === "nested"}
  <div style={frameStyle}>
    <Stack direction="row" gap="sp-24" padding="sp-16" alignItems="start">
      <Stack gap="sp-8" horizontalSizing="fill">
        <StackItem horizontalSizing="fill"><div style={boxStyle}>Nested item one</div></StackItem>
        <StackItem horizontalSizing="fill"><div style={boxStyle}>Nested item two</div></StackItem>
      </Stack>
      <StackItem><div style={boxStyle}>Sibling</div></StackItem>
    </Stack>
  </div>
{:else if showcase === "item"}
  <div style={frameStyle}>
    <Stack direction="row" gap="sp-12" padding="sp-12">
      <StackItem {...itemProps}><div style={boxStyle}>Controlled item</div></StackItem>
      <StackItem><div style={`${boxStyle} min-height: 72px;`}>Sibling</div></StackItem>
    </Stack>
  </div>
{:else if showcase === "list-items"}
  <div style={frameStyle}>
    <Stack as="ul" gap="sp-8" padding="sp-12" aria-label="Publishing steps">
      {#each steps as step (step)}
        <StackItem as="li" horizontalSizing="fill"><div style={boxStyle}>{step}</div></StackItem>
      {/each}
    </Stack>
  </div>
{/if}
