"use client"

import { ProfileForm } from "@/components/shared/feature/mypage/profile-form"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-base-100 pb-12">
      <div className="mx-auto max-w-6xl p-4">
        <ProfileForm />
      </div>
    </main>
  )
}
