"use client"

import { Suspense } from "react"
import { TermsContent } from "@/components/shared/feature/terms/terms-content"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-base-100 pb-12">
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl space-y-4 p-4">
            <div className="skeleton h-8 w-40" />
            <div className="skeleton h-64 w-full rounded-lg" />
          </div>
        }
      >
        <TermsContent />
      </Suspense>
    </main>
  )
}
