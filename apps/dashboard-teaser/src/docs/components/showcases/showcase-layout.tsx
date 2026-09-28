import styled from "styled-components"

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sp8};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
  }
`

const ShowcaseCard = styled.article`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sp16};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surfaceElevated};

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sp4};
    font-size: 0.75rem;
  }

  > p {
    min-height: 2rem;
    margin: 0 0 ${({ theme }) => theme.spacing.sp12};
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.6875rem;
    line-height: 1.4;
  }
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const ShowcaseStack = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const ShowcasePreview = styled.div`
  display: flex;
  min-width: 0;
  min-height: 4rem;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sp8};
  padding: ${({ theme }) => theme.spacing.sp12};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surface};
`

export { ButtonRow, ShowcaseCard, ShowcaseGrid, ShowcasePreview, ShowcaseStack }
