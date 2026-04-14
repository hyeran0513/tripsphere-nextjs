import { CartList } from "@/components/shared/feature/cart/cart-list"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "장바구니 | TripSphere",
}

export default function CartPage() {
  return (
    <PageBoundary>
      <CartList />
    </PageBoundary>
  )
}
