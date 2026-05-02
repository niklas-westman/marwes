import styled from "styled-components"

const SidebarContainer = styled.aside`
  padding: 24px 20px;
  background: #09090b;
  color: #a1a1aa;
  border-right: 1px solid #27272a;
  overflow-y: auto;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
  display: flex;
  flex-direction: column;
`

const SidebarHeader = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid #27272a;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #fafafa;
    letter-spacing: -0.01em;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #71717a;
  }
`

const ControlSection = styled.div`
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #27272a;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

const SectionLabel = styled.span`
  display: block;
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717a;
`

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    font-size: 13px;
    color: #a1a1aa;
  }

  input[type="color"] {
    width: 32px;
    height: 24px;
    border: 1px solid #3f3f46;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    padding: 0;

    &::-webkit-color-swatch-wrapper {
      padding: 2px;
    }
    &::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }
  }

  input[type="range"] {
    width: 100px;
    accent-color: #3b82f6;
    height: 4px;
  }

  select {
    background: #18181b;
    color: #e4e4e7;
    border: 1px solid #3f3f46;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: border-color 0.15s;

    &:hover {
      border-color: #52525b;
    }
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
`

const ModeToggle = styled.div`
  display: flex;
  gap: 2px;
  background: #18181b;
  border-radius: 6px;
  padding: 2px;
  border: 1px solid #27272a;
`

const ModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 5px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#27272a" : "transparent")};
  color: ${({ $active }) => ($active ? "#fafafa" : "#71717a")};

  &:hover {
    color: ${({ $active }) => ($active ? "#fafafa" : "#a1a1aa")};
  }
`

const RadiusValue = styled.span`
  font-size: 11px;
  color: #71717a;
  min-width: 32px;
  text-align: right;
  font-variant-numeric: tabular-nums;
`

const FontReadout = styled.p`
  font-size: 11px;
  color: #52525b;
  margin: 6px 0 0;
`

export {
  ControlRow,
  ControlSection,
  FontReadout,
  ModeButton,
  ModeToggle,
  RadiusValue,
  SectionLabel,
  SidebarContainer,
  SidebarHeader,
}
