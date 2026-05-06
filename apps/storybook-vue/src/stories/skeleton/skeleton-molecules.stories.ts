import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { SkeletonProps } from "@marwes-ui/vue"
import { Card, Skeleton, Toast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const galleryStyle =
  "display: grid; grid-template-columns: repeat(2, minmax(18rem, max-content)); gap: 1rem; align-items: start;"
const stackStyle = "display: grid; gap: 0.75rem;"
const fieldStyle = "display: grid; gap: 0.5rem; width: 20rem;"
const inputShellStyle =
  "display: flex; align-items: center; min-height: 2.75rem; padding-inline: 0.875rem; border: 1px solid var(--mw-color-border-subtle, #e5e7eb); border-radius: var(--mw-ui-radius, 4px); background: var(--mw-color-surface, #ffffff);"
const statTileStyle =
  "width: 164px; display: flex; min-width: 0; box-sizing: border-box; flex-direction: column; gap: 8px; padding: 20px; background: var(--mw-color-surface-elevated, #ffffff); border: 1px solid var(--mw-color-border-subtle, #e5e7eb); border-radius: 12px;"
const statHeaderStyle =
  "display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 8px;"
const listCardBodyStyle = "display: grid; gap: 0.875rem;"
const listRowStyle =
  "display: grid; grid-template-columns: 2.5rem 1fr 4.5rem; gap: 0.75rem; align-items: center;"
const statusOutputStyle = "display: block;"

const cardReplicaSource = `<CardSkeleton animation="pulse" />`
const statTileReplicaSource = `<StatTileSkeleton animation="pulse" />`
const inputFieldReplicaSource = `<InputFieldSkeleton animation="pulse" />`
const toastReplicaSource = `<ToastSkeleton animation="pulse" />`
const listCardReplicaSource = `<ListCardSkeleton animation="pulse" />`
const replicaGallerySource = `<div>
  <CardSkeleton animation="pulse" />
  <StatTileSkeleton animation="pulse" />
  <InputFieldSkeleton animation="pulse" />
  <ToastSkeleton animation="pulse" />
  <ListCardSkeleton animation="pulse" />
</div>`

const meta = {
  title: "Skeleton/Molecule",
  component: Skeleton as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "select",
      options: ["pulse", "wave", "none"],
    },
  },
  args: {
    animation: "pulse",
  },
} satisfies Meta<SkeletonProps>

export default meta
type Story = StoryObj<SkeletonProps>

export const CardReplica: Story = {
  render: (args: SkeletonProps) => ({
    components: { Card, Skeleton },
    setup() {
      return { args, stackStyle, statusOutputStyle }
    },
    template: `
      <output aria-busy="true" aria-label="Loading card" :style="statusOutputStyle">
        <Card :dataAttributes="{ 'data-skeleton-replica': 'card' }" style="width: 20rem;">
          <template #title>
            <Skeleton :animation="args.animation" width="56%" :height="16" />
          </template>
          <div :style="stackStyle">
            <Skeleton :animation="args.animation" variant="rectangular" width="100%" :height="112" />
            <Skeleton :animation="args.animation" width="92%" :height="12" />
            <Skeleton :animation="args.animation" width="74%" :height="12" />
          </div>
        </Card>
      </output>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: cardReplicaSource,
        language: "vue",
      },
    },
  },
}

export const StatTileReplica: Story = {
  render: (args: SkeletonProps) => ({
    components: { Skeleton },
    setup() {
      return { args, statTileStyle, statHeaderStyle }
    },
    template: `
      <article :style="statTileStyle" aria-busy="true" aria-label="Loading stat tile" data-skeleton-replica="stat-tile">
        <div :style="statHeaderStyle">
          <Skeleton :animation="args.animation" :width="84" :height="12" />
          <Skeleton :animation="args.animation" :width="36" :height="12" :radius="999" />
        </div>
        <Skeleton :animation="args.animation" :width="104" :height="28" />
        <Skeleton :animation="args.animation" :width="112" :height="12" />
      </article>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: statTileReplicaSource,
        language: "vue",
      },
    },
  },
}

export const InputFieldReplica: Story = {
  render: (args: SkeletonProps) => ({
    components: { Skeleton },
    setup() {
      return { args, fieldStyle, inputShellStyle, statusOutputStyle }
    },
    template: `
      <output aria-busy="true" aria-label="Loading input field" :style="statusOutputStyle">
        <div class="mw-input-field" :style="fieldStyle" data-skeleton-replica="input-field">
          <Skeleton :animation="args.animation" :width="96" :height="14" />
          <div class="mw-input-field__input-wrapper" :style="inputShellStyle">
            <Skeleton :animation="args.animation" width="58%" :height="14" />
          </div>
          <Skeleton :animation="args.animation" :width="144" :height="12" />
        </div>
      </output>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: inputFieldReplicaSource,
        language: "vue",
      },
    },
  },
}

export const ToastReplica: Story = {
  render: (args: SkeletonProps) => ({
    components: { Skeleton, Toast },
    setup() {
      return { args }
    },
    template: `
      <Toast variant="subtle" aria-busy="true" aria-label="Loading toast" data-skeleton-replica="toast">
        <Skeleton :animation="args.animation" :width="188" :height="14" />
        <template #action>
          <Skeleton :animation="args.animation" :width="52" :height="20" />
        </template>
      </Toast>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: toastReplicaSource,
        language: "vue",
      },
    },
  },
}

export const ListCardReplica: Story = {
  render: (args: SkeletonProps) => ({
    components: { Card, Skeleton },
    setup() {
      return {
        args,
        listCardBodyStyle,
        listRowStyle,
        stackStyle,
        statusOutputStyle,
      }
    },
    template: `
      <output aria-busy="true" aria-label="Loading list card" :style="statusOutputStyle">
        <Card :dataAttributes="{ 'data-skeleton-replica': 'list-card' }" style="width: 26rem;">
          <template #title>
            <Skeleton :animation="args.animation" :width="132" :height="16" />
          </template>
          <div :style="listCardBodyStyle">
            <div v-for="row in [0, 1, 2]" :key="row" :style="listRowStyle">
              <Skeleton :animation="args.animation" variant="circular" :width="40" :height="40" />
              <div :style="stackStyle">
                <Skeleton :animation="args.animation" width="82%" :height="12" />
                <Skeleton :animation="args.animation" width="56%" :height="12" />
              </div>
              <Skeleton :animation="args.animation" :width="60" :height="24" :radius="999" />
            </div>
          </div>
        </Card>
      </output>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: listCardReplicaSource,
        language: "vue",
      },
    },
  },
}

export const ReplicaGallery: Story = {
  render: (args: SkeletonProps) => ({
    components: { Card, Skeleton, Toast },
    setup() {
      return {
        args,
        fieldStyle,
        galleryStyle,
        inputShellStyle,
        listCardBodyStyle,
        listRowStyle,
        stackStyle,
        statHeaderStyle,
        statTileStyle,
        statusOutputStyle,
      }
    },
    template: `
      <div :style="galleryStyle">
        <output aria-busy="true" aria-label="Loading card" :style="statusOutputStyle">
          <Card :dataAttributes="{ 'data-skeleton-replica': 'card' }" style="width: 20rem;">
            <template #title>
              <Skeleton :animation="args.animation" width="56%" :height="16" />
            </template>
            <div :style="stackStyle">
              <Skeleton :animation="args.animation" variant="rectangular" width="100%" :height="112" />
              <Skeleton :animation="args.animation" width="92%" :height="12" />
              <Skeleton :animation="args.animation" width="74%" :height="12" />
            </div>
          </Card>
        </output>
        <article :style="statTileStyle" aria-busy="true" aria-label="Loading stat tile" data-skeleton-replica="stat-tile">
          <div :style="statHeaderStyle">
            <Skeleton :animation="args.animation" :width="84" :height="12" />
            <Skeleton :animation="args.animation" :width="36" :height="12" :radius="999" />
          </div>
          <Skeleton :animation="args.animation" :width="104" :height="28" />
          <Skeleton :animation="args.animation" :width="112" :height="12" />
        </article>
        <output aria-busy="true" aria-label="Loading input field" :style="statusOutputStyle">
          <div class="mw-input-field" :style="fieldStyle" data-skeleton-replica="input-field">
            <Skeleton :animation="args.animation" :width="96" :height="14" />
            <div class="mw-input-field__input-wrapper" :style="inputShellStyle">
              <Skeleton :animation="args.animation" width="58%" :height="14" />
            </div>
            <Skeleton :animation="args.animation" :width="144" :height="12" />
          </div>
        </output>
        <Toast variant="subtle" aria-busy="true" aria-label="Loading toast" data-skeleton-replica="toast">
          <Skeleton :animation="args.animation" :width="188" :height="14" />
          <template #action>
            <Skeleton :animation="args.animation" :width="52" :height="20" />
          </template>
        </Toast>
        <output aria-busy="true" aria-label="Loading list card" :style="statusOutputStyle">
          <Card :dataAttributes="{ 'data-skeleton-replica': 'list-card' }" style="width: 26rem;">
            <template #title>
              <Skeleton :animation="args.animation" :width="132" :height="16" />
            </template>
            <div :style="listCardBodyStyle">
              <div v-for="row in [0, 1, 2]" :key="row" :style="listRowStyle">
                <Skeleton :animation="args.animation" variant="circular" :width="40" :height="40" />
                <div :style="stackStyle">
                  <Skeleton :animation="args.animation" width="82%" :height="12" />
                  <Skeleton :animation="args.animation" width="56%" :height="12" />
                </div>
                <Skeleton :animation="args.animation" :width="60" :height="24" :radius="999" />
              </div>
            </div>
          </Card>
        </output>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: replicaGallerySource,
        language: "vue",
      },
    },
  },
}
