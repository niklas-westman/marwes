<script lang="ts">
  import RatingRadioGroup from "../../lib/components/radio/RatingRadioGroup.svelte";
  import YesNoRadioGroup from "../../lib/components/radio/YesNoRadioGroup.svelte";
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte";

  interface Props {
    component: "yes-no" | "rating";
  }

  let { component }: Props = $props();
</script>

<MarwesProvider>
  {#if component === "yes-no"}
    <YesNoRadioGroup name="accept" label="Accept?" />
  {:else}
    <RatingRadioGroup name="rating" label="Rating" min={1} max={2} />
  {/if}
</MarwesProvider>
