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

// Canonical Figma Spinner/Classic 1737:10526; filled outlines 1784:465 and 1784:529.
function createClassicNodes(): readonly SpinnerSvgNode[] {
  return [
    {
      tag: "path",
      attrs: {
        d: "M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22L12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24L12 22C17.5228 22 22 17.5228 22 12Z",
        transform: "translate(0 0)",
        fill: TRACK_COLOR,
      },
    },
    {
      tag: "path",
      attrs: {
        d: "M10.998 0C11.5514 2.52976e-05 12.0042 0.449531 11.958 1.00098L11.9102 1.46191C11.7784 2.53536 11.5025 3.58846 11.0869 4.5918L10.8477 5.13184C10.2592 6.37565 9.46039 7.51032 8.48535 8.48535L8.05762 8.89258C7.03807 9.8164 5.86561 10.5593 4.5918 11.0869L4.15918 11.2559C3.14218 11.6317 2.07978 11.8677 1.00098 11.958L0.898438 11.9609C0.394832 11.947 2.36891e-05 11.5167 0 10.998C2.41839e-08 10.4448 0.449559 10.0018 1 9.94629C1.84836 9.86096 2.68358 9.66695 3.48438 9.36914L3.8252 9.23535C4.88632 8.79582 5.86261 8.17681 6.71191 7.40723L7.06836 7.06836C7.88065 6.25606 8.54596 5.31065 9.03613 4.27441L9.23535 3.8252C9.60957 2.92169 9.84878 1.96946 9.94629 1C10.0018 0.44956 10.4448 0 10.998 0Z",
        transform: "translate(12 12)",
        fill: INDICATOR_COLOR,
      },
    },
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
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.89375",
    }),
    createRectNode({
      x: "15.1",
      y: "4.4",
      width: "4.8",
      height: "4.8",
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.46875",
    }),
    createRectNode({
      x: "18.5",
      y: "10",
      width: "5",
      height: "4",
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.3625",
    }),
    createRectNode({
      x: "15.1",
      y: "14.8",
      width: "4.8",
      height: "4.8",
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.15",
    }),
    createRectNode({
      x: "10",
      y: "17.5",
      width: "4",
      height: "5",
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.575",
    }),
    createRectNode({
      x: "4.1",
      y: "14.8",
      width: "4.8",
      height: "4.8",
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.7875",
    }),
    createRectNode({
      x: "0.5",
      y: "10",
      width: "5",
      height: "4",
      rx: "999",
      fill: INDICATOR_COLOR,
      opacity: "0.68125",
    }),
    createRectNode({
      x: "4.1",
      y: "4.4",
      width: "4.8",
      height: "4.8",
      rx: "999",
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
