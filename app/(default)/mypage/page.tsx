import { MypageContent } from "@/components/shared/feature/mypage/mypage-content"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "마이페이지 | TripSphere",
}

export default function MypagePage() {
  return (
    <PageBoundary>
      <MypageContent />
    </PageBoundary>
  )
}
