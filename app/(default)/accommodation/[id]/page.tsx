import { AccommodationDetail } from "@/components/shared/feature/accommodation/accommodation-detail"
import { PageBoundary } from "@/components/ui/page-boundary"

type AccommodationPageProps = {
  params: Promise<{ id: string }>
}

export default async function AccommodationPage({ params }: AccommodationPageProps) {
  const { id } = await params

  return (
    <PageBoundary>
      <AccommodationDetail accommodationId={id} />
    </PageBoundary>
  )
}
