"use client"

import { Suspense } from "react"
import { CheckoutForm } from "@/components/shared/feature/checkout/checkout-form"
import { CheckoutFallback } from "@/components/shared/feature/checkout/checkout-fallback"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutForm />
    </Suspense>
  )
}
