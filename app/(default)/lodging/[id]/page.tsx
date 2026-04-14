import { LodgingDetail } from "@/components/shared/feature/lodging/lodging-detail"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

type LodgingPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: LodgingPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `숙소 상세 #${id} | TripSphere`,
  }
}

export default async function LodgingPage({ params }: LodgingPageProps) {
  const { id } = await params

  return (
    <PageBoundary>
      <LodgingDetail lodgingId={id} />
    </PageBoundary>
  )
}
