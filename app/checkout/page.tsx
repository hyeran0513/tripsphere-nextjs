"use client"

import { Suspense } from "react"
import { CheckoutForm } from "@/components/shared/feature/checkout/checkout-form"

function CheckoutFallback() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="skeleton h-8 w-40" />
      <div className="skeleton h-48 w-full rounded-lg" />
      <div className="skeleton h-32 w-full rounded-lg" />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-base-200 pb-12">
      <Suspense fallback={<CheckoutFallback />}>
        <CheckoutForm />
      </Suspense>
    </main>
  )
}
