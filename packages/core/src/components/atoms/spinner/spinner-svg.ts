import { SpinnerVariant } from "./spinner-types"
import type {
  SpinnerSvgDefinition,
  SpinnerSvgNode,
  SpinnerVariant as SpinnerVariantValue,
} from "./spinner-types"

const INDICATOR_COLOR = "var(--mw-spinner-indicator-color)"
const TRACK_COLOR = "var(--mw-spinner-track-color)"

function createCircleNode(attrs: Record<string, string>): SpinnerSvgNode {
  return {
    tag: "circle",
    attrs,
  }
}

function createRectNode(attrs: Record<string, string>): SpinnerSvgNode {
  return {
    tag: "rect",
    attrs,
  }
}

function createClassicNodes(): readonly SpinnerSvgNode[] {
  return [
    createCircleNode({
      cx: "12",
      cy: "12",
      r: "10",
      fill: "none",
      stroke: TRACK_COLOR,
      strokeWidth: "2",
    }),
    createCircleNode({
      cx: "12",
      cy: "12",
      r: "10",
      fill: "none",
      stroke: INDICATOR_COLOR,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "15.7 47.1",
    }),
  ]
}

function createRingNodes(): readonly SpinnerSvgNode[] {
  return [
    createCircleNode({
      cx: "12",
      cy: "12",
      r: "10",
      fill: "none",
      stroke: INDICATOR_COLOR,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "31.4 31.4",
    }),
  ]
}

function createDualNodes(): readonly SpinnerSvgNode[] {
  return [
    createCircleNode({
      cx: "12",
      cy: "12",
      r: "10",
      fill: "none",
      stroke: TRACK_COLOR,
      strokeWidth: "2",
    }),
    createCircleNode({
      cx: "12",
      cy: "12",
      r: "10",
      fill: "none",
      stroke: INDICATOR_COLOR,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "15.7 47.1",
    }),
    createCircleNode({
      cx: "12",
      cy: "12",
      r: "10",
      fill: "none",
      stroke: INDICATOR_COLOR,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "15.7 47.1",
      strokeDashoffset: "-31.4",
      opacity: "0.5",
    }),
  ]
}

function createDotsRoundNodes(): readonly SpinnerSvgNode[] {
  const segmentDefinitions = [
    { cx: "12", cy: "3.5", opacity: "1" },
    { cx: "18.5", cy: "5.5", opacity: "0.46875" },
    { cx: "20.5", cy: "12", opacity: "0.3625" },
    { cx: "18.5", cy: "18.5", opacity: "0.15" },
    { cx: "12", cy: "20.5", opacity: "0.575" },
    { cx: "5.5", cy: "18.5", opacity: "0.7875" },
    { cx: "3.5", cy: "12", opacity: "0.68125" },
    { cx: "5.5", cy: "5.5", opacity: "0.25625" },
  ]

  return segmentDefinitions.map((segmentDefinition) =>
    createCircleNode({
      ...segmentDefinition,
      r: "2",
      fill: INDICATOR_COLOR,
    }),
  )
}

function createDotsSquareNodes(): readonly SpinnerSvgNode[] {
  return [
    createRectNode({
      x: "10",
      y: "1.5",
      width: "4",
      height: "5",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.89375",
    }),
    createRectNode({
      x: "15.1",
      y: "4.4",
      width: "4.8",
      height: "4.8",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.46875",
    }),
    createRectNode({
      x: "18.5",
      y: "10",
      width: "5",
      height: "4",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.3625",
    }),
    createRectNode({
      x: "15.1",
      y: "14.8",
      width: "4.8",
      height: "4.8",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.15",
    }),
    createRectNode({
      x: "10",
      y: "17.5",
      width: "4",
      height: "5",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.575",
    }),
    createRectNode({
      x: "4.1",
      y: "14.8",
      width: "4.8",
      height: "4.8",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.7875",
    }),
    createRectNode({
      x: "0.5",
      y: "10",
      width: "5",
      height: "4",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.68125",
    }),
    createRectNode({
      x: "4.1",
      y: "4.4",
      width: "4.8",
      height: "4.8",
      rx: "1.5",
      fill: INDICATOR_COLOR,
      opacity: "0.25625",
    }),
  ]
}

function createLinesNodes(): readonly SpinnerSvgNode[] {
  const lineDefinitions = [
    { angle: 0, opacity: "0.89375" },
    { angle: 45, opacity: "0.15" },
    { angle: 90, opacity: "0.25625" },
    { angle: 135, opacity: "0.3625" },
    { angle: 180, opacity: "0.46875" },
    { angle: 225, opacity: "0.575" },
    { angle: 270, opacity: "0.68125" },
    { angle: 315, opacity: "0.7875" },
  ]

  return lineDefinitions.map((lineDefinition) =>
    createRectNode({
      x: "11",
      y: "1.5",
      width: "2",
      height: "5.5",
      rx: "1",
      fill: INDICATOR_COLOR,
      opacity: lineDefinition.opacity,
      transform: `rotate(${lineDefinition.angle} 12 12)`,
    }),
  )
}

function createCrossNodes(): readonly SpinnerSvgNode[] {
  return [
    createRectNode({
      x: "10.25",
      y: "1.5",
      width: "3.5",
      height: "7",
      rx: "1",
      fill: INDICATOR_COLOR,
      opacity: "1",
    }),
    createRectNode({
      x: "15.5",
      y: "10.25",
      width: "7",
      height: "3.5",
      rx: "1",
      fill: INDICATOR_COLOR,
      opacity: "0.6",
    }),
    createRectNode({
      x: "10.25",
      y: "15.5",
      width: "3.5",
      height: "7",
      rx: "1",
      fill: INDICATOR_COLOR,
      opacity: "0.4",
    }),
    createRectNode({
      x: "1.5",
      y: "10.25",
      width: "7",
      height: "3.5",
      rx: "1",
      fill: INDICATOR_COLOR,
      opacity: "0.2",
    }),
  ]
}

function createSpinnerSvgNodes(variant: SpinnerVariantValue): readonly SpinnerSvgNode[] {
  switch (variant) {
    case SpinnerVariant.ring:
      return createRingNodes()
    case SpinnerVariant.dual:
      return createDualNodes()
    case SpinnerVariant.dotsRound:
      return createDotsRoundNodes()
    case SpinnerVariant.dotsSquare:
      return createDotsSquareNodes()
    case SpinnerVariant.lines:
      return createLinesNodes()
    case SpinnerVariant.cross:
      return createCrossNodes()
    default:
      return createClassicNodes()
  }
}

export function createSpinnerSvgDefinition(variant: SpinnerVariantValue): SpinnerSvgDefinition {
  return {
    viewBox: "0 0 24 24",
    nodes: createSpinnerSvgNodes(variant),
  }
}
