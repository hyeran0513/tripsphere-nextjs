"use client"

import { use } from "react"
import { AccommodationDetail } from "@/components/shared/feature/accommodation/accommodation-detail"

export default function AccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <main className="min-h-screen bg-base-200 pb-12">
      <AccommodationDetail accommodationId={id} />
    </main>
  )
}
