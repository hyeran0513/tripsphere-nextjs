import { CheckoutForm } from "@/components/shared/feature/checkout/checkout-form"
import { CheckoutFallback } from "@/components/shared/feature/checkout/checkout-fallback"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "결제 | TripSphere",
}

export default function CheckoutPage() {
  return (
    <PageBoundary loadingFallback={<CheckoutFallback />}>
      <CheckoutForm />
    </PageBoundary>
  )
}
