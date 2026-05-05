import { storybookLayout } from "@marwes-ui/core"
import { Card, Skeleton, type SkeletonProps, StatTile, Toast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

type SkeletonAnimation = NonNullable<SkeletonProps["animation"]>
type SkeletonDimension = NonNullable<SkeletonProps["width"]>
type SkeletonReplicaProps = {
  animation: SkeletonAnimation
}

const galleryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(18rem, max-content))",
  gap: "1rem",
  alignItems: "start",
} satisfies React.CSSProperties

const stackStyle = {
  display: "grid",
  gap: "0.75rem",
} satisfies React.CSSProperties

const fieldStyle = {
  display: "grid",
  gap: "0.5rem",
  width: "20rem",
} satisfies React.CSSProperties

const inputShellStyle = {
  display: "flex",
  alignItems: "center",
  minHeight: "2.75rem",
  paddingInline: "0.875rem",
  border: "1px solid var(--mw-color-border-subtle, #e5e7eb)",
  borderRadius: "var(--mw-ui-radius, 4px)",
  background: "var(--mw-color-surface, #ffffff)",
} satisfies React.CSSProperties

const listCardBodyStyle = {
  display: "grid",
  gap: "0.875rem",
} satisfies React.CSSProperties

const listRowStyle = {
  display: "grid",
  gridTemplateColumns: "2.5rem 1fr 4.5rem",
  gap: "0.75rem",
  alignItems: "center",
} satisfies React.CSSProperties

function resolveAnimation(animation: SkeletonProps["animation"]): SkeletonAnimation {
  return animation ?? "pulse"
}

function SkeletonLine(props: SkeletonReplicaProps & { width: SkeletonDimension }) {
  return <Skeleton animation={props.animation} width={props.width} height={12} />
}

export function CardSkeleton(props: SkeletonReplicaProps): React.ReactElement {
  return (
    <Card
      aria-busy="true"
      aria-label="Loading card"
      dataAttributes={{ "data-skeleton-replica": "card" }}
      title={<Skeleton animation={props.animation} width="56%" height={16} />}
      style={{ width: "20rem" }}
    >
      <div style={stackStyle}>
        <Skeleton animation={props.animation} variant="rectangular" width="100%" height={112} />
        <SkeletonLine animation={props.animation} width="92%" />
        <SkeletonLine animation={props.animation} width="74%" />
      </div>
    </Card>
  )
}

export function StatTileSkeleton(props: SkeletonReplicaProps): React.ReactElement {
  return (
    <StatTile
      aria-busy="true"
      aria-label="Loading stat tile"
      dataAttributes={{ "data-skeleton-replica": "stat-tile" }}
      label={<Skeleton animation={props.animation} width={84} height={12} />}
      value={<Skeleton animation={props.animation} width={104} height={28} />}
      subtitle={<Skeleton animation={props.animation} width={112} height={12} />}
      trendValue={<Skeleton animation={props.animation} width={36} height={12} radius={999} />}
    />
  )
}

export function InputFieldSkeleton(props: SkeletonReplicaProps): React.ReactElement {
  return (
    <div
      className="mw-input-field"
      style={fieldStyle}
      aria-busy="true"
      aria-label="Loading input field"
      data-skeleton-replica="input-field"
    >
      <Skeleton animation={props.animation} width={96} height={14} />
      <div className="mw-input-field__input-wrapper" style={inputShellStyle}>
        <Skeleton animation={props.animation} width="58%" height={14} />
      </div>
      <Skeleton animation={props.animation} width={144} height={12} />
    </div>
  )
}

export function ToastSkeleton(props: SkeletonReplicaProps): React.ReactElement {
  return (
    <Toast
      variant="subtle"
      aria-busy="true"
      aria-label="Loading toast"
      data-skeleton-replica="toast"
      action={<Skeleton animation={props.animation} width={52} height={20} />}
    >
      <Skeleton animation={props.animation} width={188} height={14} />
    </Toast>
  )
}

export function ListCardSkeleton(props: SkeletonReplicaProps): React.ReactElement {
  return (
    <Card
      aria-busy="true"
      aria-label="Loading list card"
      dataAttributes={{ "data-skeleton-replica": "list-card" }}
      title={<Skeleton animation={props.animation} width={132} height={16} />}
      style={{ width: "26rem" }}
    >
      <div style={listCardBodyStyle}>
        {[0, 1, 2].map((row) => (
          <div key={row} style={listRowStyle}>
            <Skeleton animation={props.animation} variant="circular" width={40} height={40} />
            <div style={stackStyle}>
              <SkeletonLine animation={props.animation} width="82%" />
              <SkeletonLine animation={props.animation} width="56%" />
            </div>
            <Skeleton animation={props.animation} width={60} height={24} radius={999} />
          </div>
        ))}
      </div>
    </Card>
  )
}

const meta = {
  title: "Skeleton/Molecule/SkeletonMolecules",
  component: Skeleton,
  parameters: storybookLayout.padded,
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
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const CardReplica: Story = {
  render: (args) => <CardSkeleton animation={resolveAnimation(args.animation)} />,
}

export const StatTileReplica: Story = {
  render: (args) => <StatTileSkeleton animation={resolveAnimation(args.animation)} />,
}

export const InputFieldReplica: Story = {
  render: (args) => <InputFieldSkeleton animation={resolveAnimation(args.animation)} />,
}

export const ToastReplica: Story = {
  render: (args) => <ToastSkeleton animation={resolveAnimation(args.animation)} />,
}

export const ListCardReplica: Story = {
  render: (args) => <ListCardSkeleton animation={resolveAnimation(args.animation)} />,
}

export const ReplicaGallery: Story = {
  render: (args) => {
    const animation = resolveAnimation(args.animation)

    return (
      <div style={galleryStyle}>
        <CardSkeleton animation={animation} />
        <StatTileSkeleton animation={animation} />
        <InputFieldSkeleton animation={animation} />
        <ToastSkeleton animation={animation} />
        <ListCardSkeleton animation={animation} />
      </div>
    )
  },
}
