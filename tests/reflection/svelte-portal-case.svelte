<script lang="ts">
  import {
    Accordion,
    Badge,
    BadgeVariant,
    Card,
    CheckboxField,
    ContextMenu,
    Dialog,
    DestructiveButton,
    Divider,
    InputField,
    InputOtp,
    MarwesProvider,
    OptionRadioGroup,
    PrimaryButton,
    Radio,
    SecondaryButton,
    Select,
    SegmentedControl,
    Slider,
    SwitchField,
    Text,
    TextButton,
    TextareaField,
    ThemeMode,
    TooltipGroup,
  } from "@marwes-ui/svelte";
  import { IconName } from "@marwes-ui/core";
  import type { ContextMenuEntry } from "@marwes-ui/core";

  let { path }: { path: string } = $props();
  const mode = $derived(path.endsWith("/dark") ? ThemeMode.dark : ThemeMode.light);
  const accordionBody =
    "Accordion content goes here. This is the expandable section that provides more detail.";
  const cardBody =
    "Card description text goes here. This provides more context about the card content.";
  const dialogDescription =
    "Describe the dialog purpose. Provide enough context for the user to understand the action or information being presented.";
  const radioGroupOptions = [
    { value: "one", label: "Label" },
    { value: "two", label: "Label" },
    { value: "three", label: "Label" },
  ];
  const segmentedControlItems = [
    { value: "one", label: "Label" },
    { value: "two", label: "Label" },
    { value: "three", label: "Label" },
  ];
  const selectOptions = [{ value: "option", label: "Option" }];

  const contextMenuItems: ContextMenuEntry[] = [
    { value: "edit", label: "Edit", icon: IconName.Edit },
    { value: "preview", label: "Preview", icon: IconName.Eye },
    { value: "download", label: "Download", icon: IconName.Download },
    { kind: "divider" },
    { value: "bookmark", label: "Bookmark", icon: IconName.Bookmark },
    { value: "report", label: "Report", icon: IconName.Flag },
    { kind: "divider" },
    { value: "delete", label: "Delete", icon: IconName.Trash },
  ];
</script>

<style>
  :global(.reflection-segmented-control) {
    inline-size: 332px;
  }
</style>

<MarwesProvider enableSystem={false} theme={{ mode }}>
  {#if path === "/reflection/accordion/expanded/light" || path === "/reflection/accordion/expanded/dark"}
    <div style="width: 360px">
      <Accordion open title="Accordion title">{accordionBody}</Accordion>
    </div>
  {:else if path === "/reflection/badge/neutral/light" || path === "/reflection/badge/neutral/dark"}
    <Badge variant={BadgeVariant.neutral}>Badge</Badge>
  {:else if path === "/reflection/badge/primary/light" || path === "/reflection/badge/primary/dark"}
    <Badge variant={BadgeVariant.info}>Badge</Badge>
  {:else if path === "/reflection/badge/success/light" || path === "/reflection/badge/success/dark"}
    <Badge variant={BadgeVariant.success}>Badge</Badge>
  {:else if path === "/reflection/badge/warning/light" || path === "/reflection/badge/warning/dark"}
    <Badge variant={BadgeVariant.warning}>Badge</Badge>
  {:else if path === "/reflection/badge/destructive/light" || path === "/reflection/badge/destructive/dark"}
    <Badge variant={BadgeVariant.error}>Badge</Badge>
  {:else if path === "/reflection/button/basic/light"}
    <PrimaryButton>Label</PrimaryButton>
  {:else if path === "/reflection/button/secondary/light"}
    <SecondaryButton>Label</SecondaryButton>
  {:else if path === "/reflection/button/text/light"}
    <TextButton>Label</TextButton>
  {:else if path === "/reflection/button/destructive/light"}
    <DestructiveButton>Delete</DestructiveButton>
  {:else if path === "/reflection/card/default/light" || path === "/reflection/card/default/dark"}
    <div style="width: 320px">
      <Card title="Card title">{cardBody}</Card>
    </div>
  {:else if path === "/reflection/checkbox/states-default/light" || path === "/reflection/checkbox/states-default/dark"}
    <div style="display: flex; align-items: center; gap: 16px">
      <CheckboxField id="reflection-checkbox-unchecked" label="Label" checkbox={{}} />
      <CheckboxField id="reflection-checkbox-checked" label="Label" checked={true} checkbox={{}} />
      <CheckboxField id="reflection-checkbox-mixed" label="Label" checkbox={{ indeterminate: true }} />
    </div>
  {:else if path === "/reflection/context-menu/full/light" || path === "/reflection/context-menu/full/dark"}
    <ContextMenu items={contextMenuItems} ariaLabel="Context menu" />
  {:else if path === "/reflection/dialog/medium/light" || path === "/reflection/dialog/medium/dark"}
    <Dialog
      title="Dialog title"
      description={dialogDescription}
      size="medium"
      onclose={() => undefined}
    >
      {#snippet footer()}
        <PrimaryButton>Label</PrimaryButton>
        <SecondaryButton>Label</SecondaryButton>
      {/snippet}
    </Dialog>
  {:else if path === "/reflection/divider/sp-16/light" || path === "/reflection/divider/sp-16/dark"}
    <div style="width: 480px">
      <Divider size="sm" />
    </div>
  {:else if path === "/reflection/input-fields/default/light" || path === "/reflection/input-fields/default/dark"}
    <div style="width: 460px">
      <InputField
        id="reflection-input-field-460"
        label="Label"
        helperText="Hint text"
        input={{ placeholder: "Enter text" }}
      />
    </div>
  {:else if path === "/reflection/input-types-overview/text/light" || path === "/reflection/input-types-overview/text/dark"}
    <div style="width: 288px">
      <InputField
        id="reflection-input-field-288"
        label="Label"
        helperText="Hint text"
        input={{ placeholder: "Enter text" }}
      />
    </div>
  {:else if path === "/reflection/input-otp/default/light" || path === "/reflection/input-otp/default/dark"}
    <InputOtp
      id="reflection-input-otp"
      label="Verification code"
      helperText="Enter the 6-digit code sent to your email"
      placeholderCharacter="·"
    />
  {:else if path === "/reflection/radio/states-default/light" || path === "/reflection/radio/states-default/dark"}
    <div style="display: flex; align-items: center; gap: 24px">
      <label style="display: inline-flex; height: 32px; align-items: center; gap: 8px">
        <Radio name="reflection-radio-states" checked={true} ariaLabel="Label" />
        <Text variant="label">Label</Text>
      </label>
      <label style="display: inline-flex; height: 32px; align-items: center; gap: 8px">
        <Radio name="reflection-radio-states" ariaLabel="Label" />
        <Text variant="label">Label</Text>
      </label>
    </div>
  {:else if path === "/reflection/radio-group/default/light" || path === "/reflection/radio-group/default/dark"}
    <OptionRadioGroup
      name="reflection-radio-group"
      label="Group label"
      description="Select one option"
      defaultValue="one"
      options={radioGroupOptions}
    />
  {:else if path === "/reflection/segmented-control/three-segments/light" || path === "/reflection/segmented-control/three-segments/dark"}
    <SegmentedControl
      class="reflection-segmented-control"
      ariaLabel="Reflection segmented control"
      defaultValue="one"
      items={segmentedControlItems}
    />
  {:else if path === "/reflection/slider/default/light" || path === "/reflection/slider/default/dark"}
    <div style="width: 260px">
      <Slider
        ariaLabel="Reflection slider"
        value={path.endsWith("/dark") ? 42 : 63.2}
        showTooltip={false}
        style="width: 260px"
      />
    </div>
  {:else if path === "/reflection/switch/states-default/light" || path === "/reflection/switch/states-default/dark"}
    <div style="display: flex; align-items: center; gap: 24px">
      <SwitchField label="Label" switch={{ checked: true }} />
      <SwitchField label="Label" switch={{}} />
    </div>
  {:else if path === "/reflection/select/default/light" || path === "/reflection/select/default/dark"}
    <Select ariaLabel="Option" value="option" options={selectOptions} native={false} />
  {:else if path === "/reflection/textarea/default/light" || path === "/reflection/textarea/default/dark"}
    <div style="width: 288px">
      <TextareaField
        id="reflection-textarea"
        label="Label"
        helperText="Hint text"
        counterText="0/100"
        textarea={{ placeholder: "Enter message..." }}
      />
    </div>
  {:else if path === "/reflection/tooltip/with-help-icon/light" || path === "/reflection/tooltip/with-help-icon/dark"}
    <TooltipGroup open={true} content="Tooltip text" triggerLabel="Show tooltip" />
  {/if}
</MarwesProvider>
