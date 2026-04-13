"use client"

import { useRouter } from "next/navigation"
import { ClipboardList } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useOrdersQuery } from "@/hooks/queries/use-orders-query"
import { OrderCard } from "@/components/shared/feature/order/order-card"

export function OrderList() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: orders, isLoading } = useOrdersQuery(user?.uid ?? null)

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-36 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
        <ClipboardList className="mb-3 size-12" />
        <p className="text-lg font-medium">로그인이 필요합니다</p>
        <button
          type="button"
          className="btn btn-primary btn-sm mt-4"
          onClick={() => router.push(PATH.LOGIN)}
        >
          로그인하기
        </button>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
        <ClipboardList className="mb-3 size-12" />
        <p className="text-lg font-medium">예약 내역이 없습니다</p>
        <p className="text-sm">숙소를 검색하고 예약해보세요.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">예약 내역 ({orders.length})</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
