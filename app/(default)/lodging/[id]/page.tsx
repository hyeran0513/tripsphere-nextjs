import { LodgingDetail } from "@/components/shared/feature/lodging/lodging-detail"
import { PageBoundary } from "@/components/ui/page-boundary"

type LodgingPageProps = {
  params: Promise<{ id: string }>
}

export default async function LodgingPage({ params }: LodgingPageProps) {
  const { id } = await params

  return (
    <PageBoundary>
      <LodgingDetail lodgingId={id} />
    </PageBoundary>
  )
}
