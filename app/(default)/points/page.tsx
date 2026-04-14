import { PointsPageContent } from "@/components/shared/feature/points/points-page-content"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "포인트 내역 | TripSphere",
}

export default function PointsPage() {
  return (
    <PageBoundary>
      <PointsPageContent />
    </PageBoundary>
  )
}
