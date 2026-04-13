import { OrderList } from "@/components/shared/feature/order/order-list"
import { PageBoundary } from "@/components/ui/page-boundary"

export default function OrdersPage() {
  return (
    <PageBoundary>
      <OrderList />
    </PageBoundary>
  )
}
