import { CheckoutForm } from "@/components/shared/feature/checkout/checkout-form"
import { CheckoutFallback } from "@/components/shared/feature/checkout/checkout-fallback"
import { PageBoundary } from "@/components/ui/page-boundary"

export default function CheckoutPage() {
  return (
    <PageBoundary loadingFallback={<CheckoutFallback />}>
      <CheckoutForm />
    </PageBoundary>
  )
}
