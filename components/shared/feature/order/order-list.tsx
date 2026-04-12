"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardList, XCircle } from "lucide-react"
import { getStayTypeLabel } from "@/types/room"
import { format } from "date-fns"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useOrdersQuery, type OrderWithDetails } from "@/hooks/queries/use-orders-query"
import { useCancelOrderMutation } from "@/hooks/mutations/use-order-mutation"

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  completed: { text: "결제 완료", className: "badge-success" },
  pending: { text: "결제 대기", className: "badge-warning" },
  cancelled: { text: "취소됨", className: "badge-error" },
}

function OrderCard({ order }: { order: OrderWithDetails }) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const cancelOrder = useCancelOrderMutation()

  const status = STATUS_LABEL[order.payment_status] ?? STATUS_LABEL.pending
  const orderDate = format(new Date(order.order_date), "yyyy.MM.dd HH:mm")
  const handleCancel = async () => {
    await cancelOrder.mutateAsync({
      order_id: order.id,
      user_id: order.user_id,
      used_points: order.used_points,
      cancel_reason: cancelReason || undefined,
    })
    setShowCancelModal(false)
    setCancelReason("")
  }

  return (
    <>
      <div className="card card-side border border-base-300 bg-base-100">
        <figure className="w-32 shrink-0 sm:w-40">
          {order.room?.image ? (
            <img
              src={order.room.image}
              alt={order.room?.name ?? "객실"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-xs text-base-content/30">
              이미지 없음
            </div>
          )}
        </figure>

        <div className="card-body gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              {order.room?.accommodation_name && (
                <p className="text-xs text-base-content/50">{order.room.accommodation_name}</p>
              )}
              <h3 className="card-title text-base">{order.room?.name ?? "객실 정보 없음"}</h3>
            </div>
            <span className={`badge badge-sm ${status.className}`}>{status.text}</span>
          </div>

          <div className="flex flex-col gap-1 text-sm text-base-content/70">
            <span>주문일: {orderDate}</span>
            {order.room?.stay_type && <span>{getStayTypeLabel(order.room.stay_type)}</span>}
            {order.selectedTime && <span>입실 시간: {order.selectedTime}</span>}
            {order.duration?.hours && <span>이용 시간: {order.duration.hours}시간</span>}
            <span className="font-semibold text-primary">
              {order.used_points.toLocaleString()}P
            </span>
          </div>

          {order.cancel_reason && (
            <p className="text-xs text-error">취소 사유: {order.cancel_reason}</p>
          )}

          {order.payment_status === "completed" && (
            <div className="card-actions mt-1">
              <button
                type="button"
                className="btn btn-outline btn-error btn-xs"
                onClick={() => setShowCancelModal(true)}
              >
                <XCircle className="size-3.5" />
                예약 취소
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 취소 모달 */}
      {showCancelModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">예약 취소</h3>
            <p className="mt-2 text-sm text-base-content/70">
              정말 예약을 취소하시겠습니까? {order.used_points.toLocaleString()}P가 환불됩니다.
            </p>
            <div className="form-control mt-4">
              <label className="label" htmlFor="cancelReason">
                <span className="label-text">취소 사유 (선택)</span>
              </label>
              <textarea
                id="cancelReason"
                className="textarea textarea-bordered w-full"
                placeholder="취소 사유를 입력해주세요"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason("")
                }}
              >
                닫기
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                disabled={cancelOrder.isPending}
                onClick={handleCancel}
              >
                {cancelOrder.isPending ? "취소 중..." : "예약 취소"}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setShowCancelModal(false)}>
              close
            </button>
          </form>
        </dialog>
      )}
    </>
  )
}

export function OrderList() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: orders, isLoading } = useOrdersQuery(user?.uid ?? null)

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-32 w-full rounded-lg" />
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
        <p className="text-lg font-medium">주문 내역이 없습니다</p>
        <p className="text-sm">숙소를 검색하고 예약해보세요.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">주문 내역 ({orders.length})</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
