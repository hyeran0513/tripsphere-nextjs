"use client"

import { useRouter } from "next/navigation"
import { ClipboardList } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useOrdersQuery } from "@/hooks/queries/use-orders-query"
import { OrderCard } from "@/components/shared/feature/order/order-card"
import { NoData } from "@/components/ui/no-data"

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
      <NoData icon={<ClipboardList className="mb-3 size-12" />} title="로그인이 필요합니다">
        <button
          type="button"
          className="btn btn-primary btn-sm mt-4"
          onClick={() => router.push(PATH.LOGIN)}
        >
          로그인하기
        </button>
      </NoData>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <NoData
        icon={<ClipboardList className="mb-3 size-12" />}
        title="예약 내역이 없습니다"
        description="숙소를 검색하고 예약해보세요."
      />
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
