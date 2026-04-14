import { OrderList } from "@/components/shared/feature/order/order-list"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "예약 내역 | TripSphere",
}

export default function OrdersPage() {
  return (
    <PageBoundary>
      <OrderList />
    </PageBoundary>
  )
}
