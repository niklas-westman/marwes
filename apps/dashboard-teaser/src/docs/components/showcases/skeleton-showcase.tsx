import { Skeleton } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcasePreview, ShowcaseStack } from "./showcase-layout"

function SkeletonShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Text structure</h3>
        <p>Decorative lines preserve the rhythm of text while content loads.</p>
        <ShowcaseStack>
          <Skeleton width="80%" height={12} />
          <Skeleton width="55%" height={12} />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Avatar and media</h3>
        <p>Shape and dimensions should reflect the content they replace.</p>
        <ShowcasePreview>
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="rectangular" width={120} height={64} radius={8} />
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Standalone loading status</h3>
        <p>Only a standalone loading region needs its own announced status.</p>
        <ShowcasePreview>
          <Skeleton
            decorative={false}
            ariaLabel="Loading profile summary"
            variant="rectangular"
            width="100%"
            height={64}
          />
        </ShowcasePreview>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default SkeletonShowcase
