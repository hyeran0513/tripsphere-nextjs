"use client"

import { Suspense } from "react"
import { TermsContent } from "@/components/shared/feature/terms/terms-content"
import { TermsFallback } from "@/components/shared/feature/terms/terms-fallback"

export default function TermsPage() {
  return (
    <Suspense fallback={<TermsFallback />}>
      <TermsContent />
    </Suspense>
  )
}
