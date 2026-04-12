"use client"

import { use } from "react"
import { AccommodationDetail } from "@/components/shared/feature/accommodation/accommodation-detail"

export default function AccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return <AccommodationDetail accommodationId={id} />
}
