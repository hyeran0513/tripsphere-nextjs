import { ProfileForm } from "@/components/shared/feature/mypage/profile-form"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "프로필 설정 | TripSphere",
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl p-4">
      <PageBoundary>
        <ProfileForm />
      </PageBoundary>
    </div>
  )
}
