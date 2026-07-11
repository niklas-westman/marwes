import styled from "styled-components"

/**
 * Wraps a SegmentedControl so it stays fully rendered even when its items
 * exceed the available width — the track expands to max-content and scrolls
 * horizontally inside this container. Below overflow it fills the wrapper
 * (min-inline-size: 100%) so the flex distribution still looks right when
 * items fit.
 */
const SegmentedControlScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-block-end: ${({ theme }) => theme.spacing.sp2};

  &::-webkit-scrollbar {
    display: none;
  }

  .mw-segmented-control {
    max-inline-size: none;
    min-inline-size: 100%;
    inline-size: max-content;
  }
`

export { SegmentedControlScroll }
