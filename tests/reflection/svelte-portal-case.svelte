<script lang="ts">
  import { recordButtonActivation } from "./support/button-activation";
  import {
    Button,
    IconButton,
    CancelButton,
    CopyButton,
    FilterButton,
    SortButton,
    CloseButton,
    RefreshButton,
    SuccessButton,
    SubmitButton,
    SaveButton,
    ConfirmButton,
    VerifyButton,
    CreateButton,
    EditButton,
    UploadButton,
    DownloadButton,
    SearchButton,
    DropdownButton,
    LinkButton,
    Badge,
    BadgeVariant,
    Card,
    CheckboxField,
    ContextMenu,
    Dialog,
    DestructiveButton,
    Divider,
    InputField,
    MarwesProvider,
    OptionRadioGroup,
    PrimaryButton,
    SecondaryButton,
    SwitchField,
    Text,
    TextButton,
    TextareaField,
    ThemeMode,
    TooltipGroup,
  } from "@marwes-ui/svelte";
  import { IconName } from "@marwes-ui/core";
  import type { ContextMenuEntry } from "@marwes-ui/core";
  import Accordion from "../../packages/svelte/src/lib/components/accordion/Accordion.svelte";
  import InputOtp from "../../packages/svelte/src/lib/components/input/InputOtp.svelte";
  import Select from "../../packages/svelte/src/lib/components/input/Select.svelte";
  import Radio from "../../packages/svelte/src/lib/components/radio/Radio.svelte";
  import SegmentedControl from "../../packages/svelte/src/lib/components/segmented-control/SegmentedControl.svelte";
  import Slider from "../../packages/svelte/src/lib/components/slider/Slider.svelte";

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
  {:else if path === "/reflection/button/basic-icon-right/light" || path === "/reflection/button/basic-icon-right/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-left/light" || path === "/reflection/button/basic-icon-left/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</PrimaryButton>
  {:else if path === "/reflection/button/standard-focus-example/light" || path === "/reflection/button/standard-focus-example/dark"}
    <PrimaryButton onclick={recordButtonActivation}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic/light" || path === "/reflection/button/basic/dark"}
    <PrimaryButton onclick={recordButtonActivation}>Label</PrimaryButton>
  {:else if path === "/reflection/button/secondary-icon-right/light" || path === "/reflection/button/secondary-icon-right/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-left/light" || path === "/reflection/button/secondary-icon-left/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary/light" || path === "/reflection/button/secondary/dark"}
    <SecondaryButton onclick={recordButtonActivation}>Label</SecondaryButton>
  {:else if path === "/reflection/button/text-icon-right/light" || path === "/reflection/button/text-icon-right/dark"}
    <TextButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</TextButton>
  {:else if path === "/reflection/button/text-icon-left/light" || path === "/reflection/button/text-icon-left/dark"}
    <TextButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</TextButton>
  {:else if path === "/reflection/button/text/light" || path === "/reflection/button/text/dark"}
    <TextButton onclick={recordButtonActivation}>Label</TextButton>
  {:else if path === "/reflection/button/basic-icon-right-hover/light" || path === "/reflection/button/basic-icon-right-hover/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-left-hover/light" || path === "/reflection/button/basic-icon-left-hover/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-hover/light" || path === "/reflection/button/basic-hover/dark"}
    <PrimaryButton onclick={recordButtonActivation}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-right-pressed/light" || path === "/reflection/button/basic-icon-right-pressed/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-left-pressed/light" || path === "/reflection/button/basic-icon-left-pressed/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-pressed/light" || path === "/reflection/button/basic-pressed/dark"}
    <PrimaryButton onclick={recordButtonActivation}>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-right-disabled/light" || path === "/reflection/button/basic-icon-right-disabled/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-left-disabled/light" || path === "/reflection/button/basic-icon-left-disabled/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-disabled/light" || path === "/reflection/button/basic-disabled/dark"}
    <PrimaryButton onclick={recordButtonActivation} disabled>Label</PrimaryButton>
  {:else if path === "/reflection/button/secondary-icon-right-hover/light" || path === "/reflection/button/secondary-icon-right-hover/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-left-hover/light" || path === "/reflection/button/secondary-icon-left-hover/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-hover/light" || path === "/reflection/button/secondary-hover/dark"}
    <SecondaryButton onclick={recordButtonActivation}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-right-pressed/light" || path === "/reflection/button/secondary-icon-right-pressed/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-left-pressed/light" || path === "/reflection/button/secondary-icon-left-pressed/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-pressed/light" || path === "/reflection/button/secondary-pressed/dark"}
    <SecondaryButton onclick={recordButtonActivation}>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-right-disabled/light" || path === "/reflection/button/secondary-icon-right-disabled/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-left-disabled/light" || path === "/reflection/button/secondary-icon-left-disabled/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-disabled/light" || path === "/reflection/button/secondary-disabled/dark"}
    <SecondaryButton onclick={recordButtonActivation} disabled>Label</SecondaryButton>
  {:else if path === "/reflection/button/text-icon-right-hover/light" || path === "/reflection/button/text-icon-right-hover/dark"}
    <TextButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</TextButton>
  {:else if path === "/reflection/button/text-icon-left-hover/light" || path === "/reflection/button/text-icon-left-hover/dark"}
    <TextButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</TextButton>
  {:else if path === "/reflection/button/text-hover/light" || path === "/reflection/button/text-hover/dark"}
    <TextButton onclick={recordButtonActivation}>Label</TextButton>
  {:else if path === "/reflection/button/text-icon-right-pressed/light" || path === "/reflection/button/text-icon-right-pressed/dark"}
    <TextButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight}>Label</TextButton>
  {:else if path === "/reflection/button/text-icon-left-pressed/light" || path === "/reflection/button/text-icon-left-pressed/dark"}
    <TextButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft}>Label</TextButton>
  {:else if path === "/reflection/button/text-pressed/light" || path === "/reflection/button/text-pressed/dark"}
    <TextButton onclick={recordButtonActivation}>Label</TextButton>
  {:else if path === "/reflection/button/text-icon-right-disabled/light" || path === "/reflection/button/text-icon-right-disabled/dark"}
    <TextButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} disabled>Label</TextButton>
  {:else if path === "/reflection/button/text-icon-left-disabled/light" || path === "/reflection/button/text-icon-left-disabled/dark"}
    <TextButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} disabled>Label</TextButton>
  {:else if path === "/reflection/button/text-disabled/light" || path === "/reflection/button/text-disabled/dark"}
    <TextButton onclick={recordButtonActivation} disabled>Label</TextButton>
  {:else if path === "/reflection/button/basic-icon-right-sm/light" || path === "/reflection/button/basic-icon-right-sm/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} size="sm">Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-left-sm/light" || path === "/reflection/button/basic-icon-left-sm/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="sm">Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-sm/light" || path === "/reflection/button/basic-sm/dark"}
    <PrimaryButton onclick={recordButtonActivation} size="sm">Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-right-lg/light" || path === "/reflection/button/basic-icon-right-lg/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} size="lg">Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-icon-left-lg/light" || path === "/reflection/button/basic-icon-left-lg/dark"}
    <PrimaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="lg">Label</PrimaryButton>
  {:else if path === "/reflection/button/basic-lg/light" || path === "/reflection/button/basic-lg/dark"}
    <PrimaryButton onclick={recordButtonActivation} size="lg">Label</PrimaryButton>
  {:else if path === "/reflection/button/secondary-icon-right-sm/light" || path === "/reflection/button/secondary-icon-right-sm/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} size="sm">Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-left-sm/light" || path === "/reflection/button/secondary-icon-left-sm/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="sm">Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-sm/light" || path === "/reflection/button/secondary-sm/dark"}
    <SecondaryButton onclick={recordButtonActivation} size="sm">Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-right-lg/light" || path === "/reflection/button/secondary-icon-right-lg/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconRight={IconName.ArrowRight} size="lg">Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-icon-left-lg/light" || path === "/reflection/button/secondary-icon-left-lg/dark"}
    <SecondaryButton onclick={recordButtonActivation} iconLeft={IconName.ArrowLeft} size="lg">Label</SecondaryButton>
  {:else if path === "/reflection/button/secondary-lg/light" || path === "/reflection/button/secondary-lg/dark"}
    <SecondaryButton onclick={recordButtonActivation} size="lg">Label</SecondaryButton>
  {:else if path === "/reflection/button/destructive/light"}
    <DestructiveButton onclick={recordButtonActivation} size="sm" iconRight={IconName.X}>Delete</DestructiveButton>
  {:else if path === "/reflection/card/default/light" || path === "/reflection/card/default/dark"}
    <div style="width: 320px">
      <Card title="Card title">{cardBody}</Card>
    </div>
  {:else if path === "/reflection/button/success-default/light" || path === "/reflection/button/success-default/dark"}
    <SuccessButton onclick={recordButtonActivation}>Confirm</SuccessButton>
  {:else if path === "/reflection/button/success-hover/light" || path === "/reflection/button/success-hover/dark"}
    <SuccessButton onclick={recordButtonActivation}>Confirm</SuccessButton>
  {:else if path === "/reflection/button/success-pressed/light" || path === "/reflection/button/success-pressed/dark"}
    <SuccessButton onclick={recordButtonActivation}>Confirm</SuccessButton>
  {:else if path === "/reflection/button/success-disabled/light" || path === "/reflection/button/success-disabled/dark"}
    <SuccessButton onclick={recordButtonActivation} disabled={true}>Confirm</SuccessButton>
  {:else if path === "/reflection/button/success-error/light" || path === "/reflection/button/success-error/dark"}
    <SuccessButton onclick={recordButtonActivation} error={true}>Confirm</SuccessButton>
  {:else if path === "/reflection/button/danger-default/light" || path === "/reflection/button/danger-default/dark"}
    <DestructiveButton onclick={recordButtonActivation} size={"sm"}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/danger-hover/light" || path === "/reflection/button/danger-hover/dark"}
    <DestructiveButton onclick={recordButtonActivation} size={"sm"}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/danger-pressed/light" || path === "/reflection/button/danger-pressed/dark"}
    <DestructiveButton onclick={recordButtonActivation} size={"sm"}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/danger-disabled/light" || path === "/reflection/button/danger-disabled/dark"}
    <DestructiveButton onclick={recordButtonActivation} size={"sm"} disabled={true}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/danger-error/light" || path === "/reflection/button/danger-error/dark"}
    <DestructiveButton onclick={recordButtonActivation} size={"sm"} error={true}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/primary-error/light" || path === "/reflection/button/primary-error/dark"}
    <PrimaryButton onclick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>Label</PrimaryButton>
  {:else if path === "/reflection/button/secondary-error/light" || path === "/reflection/button/secondary-error/dark"}
    <SecondaryButton onclick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>Label</SecondaryButton>
  {:else if path === "/reflection/button/text-error/light" || path === "/reflection/button/text-error/dark"}
    <TextButton onclick={recordButtonActivation} error={true} iconRight={IconName.ArrowRight}>Label</TextButton>
  {:else if path === "/reflection/button/purpose-submit/light" || path === "/reflection/button/purpose-submit/dark"}
    <SubmitButton onclick={recordButtonActivation}>Submit</SubmitButton>
  {:else if path === "/reflection/button/purpose-save/light" || path === "/reflection/button/purpose-save/dark"}
    <SaveButton onclick={recordButtonActivation}>Save</SaveButton>
  {:else if path === "/reflection/button/purpose-confirm/light" || path === "/reflection/button/purpose-confirm/dark"}
    <ConfirmButton onclick={recordButtonActivation}>Confirm</ConfirmButton>
  {:else if path === "/reflection/button/purpose-destructive/light" || path === "/reflection/button/purpose-destructive/dark"}
    <DestructiveButton onclick={recordButtonActivation} size={"sm"}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/purpose-verify/light" || path === "/reflection/button/purpose-verify/dark"}
    <VerifyButton onclick={recordButtonActivation}>Verify</VerifyButton>
  {:else if path === "/reflection/button/purpose-create/light" || path === "/reflection/button/purpose-create/dark"}
    <CreateButton onclick={recordButtonActivation}>Create</CreateButton>
  {:else if path === "/reflection/button/purpose-edit/light" || path === "/reflection/button/purpose-edit/dark"}
    <EditButton onclick={recordButtonActivation}>Edit</EditButton>
  {:else if path === "/reflection/button/purpose-upload/light" || path === "/reflection/button/purpose-upload/dark"}
    <UploadButton onclick={recordButtonActivation}>Upload</UploadButton>
  {:else if path === "/reflection/button/purpose-download/light" || path === "/reflection/button/purpose-download/dark"}
    <DownloadButton onclick={recordButtonActivation}>Download</DownloadButton>
  {:else if path === "/reflection/button/purpose-search/light" || path === "/reflection/button/purpose-search/dark"}
    <SearchButton onclick={recordButtonActivation}>Search</SearchButton>
  {:else if path === "/reflection/button/purpose-dropdown/light" || path === "/reflection/button/purpose-dropdown/dark"}
    <DropdownButton onclick={recordButtonActivation}>Options</DropdownButton>
  {:else if path === "/reflection/button/purpose-navigation/light" || path === "/reflection/button/purpose-navigation/dark"}
    <LinkButton onclick={recordButtonActivation} href={"#governance-target"}>Link</LinkButton>
  {:else if path === "/reflection/button/secondary-loading/light" || path === "/reflection/button/secondary-loading/dark"}
    <SecondaryButton onclick={recordButtonActivation} loading={{ isLoading: true, loadingLabel: "Please wait" }}>Please wait</SecondaryButton>
  {:else if path === "/reflection/button/neutral-default/light" || path === "/reflection/button/neutral-default/dark"}
    <Button onclick={recordButtonActivation} variant={"neutral"}>Cancel</Button>
  {:else if path === "/reflection/button/neutral-hover/light" || path === "/reflection/button/neutral-hover/dark"}
    <Button onclick={recordButtonActivation} variant={"neutral"}>Cancel</Button>
  {:else if path === "/reflection/button/neutral-pressed/light" || path === "/reflection/button/neutral-pressed/dark"}
    <Button onclick={recordButtonActivation} variant={"neutral"}>Cancel</Button>
  {:else if path === "/reflection/button/neutral-disabled/light" || path === "/reflection/button/neutral-disabled/dark"}
    <Button onclick={recordButtonActivation} variant={"neutral"} disabled={true}>Cancel</Button>
  {:else if path === "/reflection/button/neutral-error/light" || path === "/reflection/button/neutral-error/dark"}
    <Button onclick={recordButtonActivation} variant={"neutral"} error={true}>Cancel</Button>
  {:else if path === "/reflection/button/neutral-icon-left-default/light" || path === "/reflection/button/neutral-icon-left-default/dark"}
    <RefreshButton onclick={recordButtonActivation}>Refresh</RefreshButton>
  {:else if path === "/reflection/button/neutral-icon-left-hover/light" || path === "/reflection/button/neutral-icon-left-hover/dark"}
    <RefreshButton onclick={recordButtonActivation}>Refresh</RefreshButton>
  {:else if path === "/reflection/button/neutral-icon-left-pressed/light" || path === "/reflection/button/neutral-icon-left-pressed/dark"}
    <RefreshButton onclick={recordButtonActivation}>Refresh</RefreshButton>
  {:else if path === "/reflection/button/neutral-icon-left-disabled/light" || path === "/reflection/button/neutral-icon-left-disabled/dark"}
    <RefreshButton onclick={recordButtonActivation} disabled={true}>Refresh</RefreshButton>
  {:else if path === "/reflection/button/neutral-icon-left-error/light" || path === "/reflection/button/neutral-icon-left-error/dark"}
    <RefreshButton onclick={recordButtonActivation} error={true}>Refresh</RefreshButton>
  {:else if path === "/reflection/button/purpose-cancel/light" || path === "/reflection/button/purpose-cancel/dark"}
    <CancelButton onclick={recordButtonActivation}>Cancel</CancelButton>
  {:else if path === "/reflection/button/purpose-copy/light" || path === "/reflection/button/purpose-copy/dark"}
    <CopyButton onclick={recordButtonActivation}>Copy</CopyButton>
  {:else if path === "/reflection/button/purpose-filter/light" || path === "/reflection/button/purpose-filter/dark"}
    <FilterButton onclick={recordButtonActivation}>Filter</FilterButton>
  {:else if path === "/reflection/button/purpose-sort/light" || path === "/reflection/button/purpose-sort/dark"}
    <SortButton onclick={recordButtonActivation}>Sort</SortButton>
  {:else if path === "/reflection/button/purpose-close/light" || path === "/reflection/button/purpose-close/dark"}
    <CloseButton onclick={recordButtonActivation}>Close</CloseButton>
  {:else if path === "/reflection/button/purpose-refresh/light" || path === "/reflection/button/purpose-refresh/dark"}
    <RefreshButton onclick={recordButtonActivation}>Refresh</RefreshButton>
  {:else if path === "/reflection/button/success-icon-left-default/light" || path === "/reflection/button/success-icon-left-default/dark"}
    <SuccessButton onclick={recordButtonActivation} iconLeft={IconName.Check}>Success</SuccessButton>
  {:else if path === "/reflection/button/danger-icon-left-default/light" || path === "/reflection/button/danger-icon-left-default/dark"}
    <DestructiveButton onclick={recordButtonActivation} iconLeft={IconName.X} size={"sm"}>Delete</DestructiveButton>
  {:else if path === "/reflection/button/icon-only-neutral-default/light" || path === "/reflection/button/icon-only-neutral-default/dark"}
    <IconButton onclick={recordButtonActivation} icon={IconName.X} size="md" variant="neutral" ariaLabel="Close" />
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
