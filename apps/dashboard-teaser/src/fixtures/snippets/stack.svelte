<script lang="ts">
  import { Paragraph, PrimaryButton, Stack, StackItem } from "@marwes-ui/svelte"
</script>

<Stack direction="row" gap="sp-16" padding="sp-24" alignItems="center">
  <StackItem horizontalSizing="fill">
    <Paragraph>Grows to fill the row</Paragraph>
  </StackItem>
  <StackItem>
    <PrimaryButton>Save</PrimaryButton>
  </StackItem>
</Stack>
