"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ClipboardList, Pencil, Star } from "lucide-react"
import { getStayTypeLabel } from "@/types/room"
import { format } from "date-fns"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useOrdersQuery, type OrderWithDetails } from "@/hooks/queries/use-orders-query"
import { useCancelOrderMutation } from "@/hooks/mutations/use-order-mutation"
import { useCreateReviewMutation } from "@/hooks/mutations/use-review-mutation"

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  completed: { text: "예약 완료", className: "badge-outline" },
  pending: { text: "결제 대기", className: "badge-outline" },
  cancelled: { text: "취소됨", className: "badge-outline" },
}

function ReviewModal({ order, onClose }: { order: OrderWithDetails; onClose: () => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const createReview = useCreateReviewMutation()

  const handleSubmit = async () => {
    if (!order.room?.accommodation_id || !comment.trim()) return

    await createReview.mutateAsync({
      accommodation_id: order.room.accommodation_id,
      user_id: order.user_id,
      order_id: order.id,
      rating,
      comment: comment.trim(),
    })
    onClose()
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">리뷰 작성</h3>
        <p className="mt-1 text-sm text-base-content/60">
          {order.room?.accommodation_name} · {order.room?.name}
        </p>

        {/* 별점 */}
        <div className="mt-4">
          <label className="label">
            <span className="label-text font-medium">별점</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} type="button" className="cursor-pointer" onClick={() => setRating(v)}>
                <Star
                  className={`size-7 ${v <= rating ? "fill-warning text-warning" : "text-base-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 내용 */}
        <div className="form-control mt-4">
          <label className="label" htmlFor="reviewComment">
            <span className="label-text font-medium">리뷰 내용</span>
          </label>
          <textarea
            id="reviewComment"
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="숙소 이용 후기를 작성해주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            닫기
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!comment.trim() || createReview.isPending}
            onClick={handleSubmit}
          >
            {createReview.isPending ? "작성 중..." : "리뷰 등록"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  )
}

function OrderCard({ order }: { order: OrderWithDetails }) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const cancelOrder = useCancelOrderMutation()

  const status = STATUS_LABEL[order.payment_status] ?? STATUS_LABEL.pending
  const orderDate = format(new Date(order.order_date), "yyyy.MM.dd HH:mm")
  const canReview = order.payment_status === "completed" && !order.reviewed

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
        {/* 이미지 (왼쪽) */}
        <figure className="relative min-h-32 w-40 shrink-0 sm:min-h-36 sm:w-52">
          {order.room?.image ? (
            <Image
              src={order.room.image}
              alt={order.room?.name ?? "객실"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 10rem, 13rem"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-xs text-base-content/30">
              이미지 없음
            </div>
          )}
        </figure>

        {/* 정보 (중앙 + 오른쪽) */}
        <div className="flex flex-1 items-center justify-between gap-4 p-4">
          {/* 왼쪽 정보 */}
          <div className="flex flex-col gap-1">
            {order.room?.accommodation_name && (
              <p className="text-xs text-base-content/50">{order.room.accommodation_name}</p>
            )}
            <h3 className="text-base font-semibold">{order.room?.name ?? "객실 정보 없음"}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge badge-sm ${status.className}`}>{status.text}</span>
              {order.room?.stay_type && (
                <span className="badge badge-outline badge-sm">
                  {getStayTypeLabel(order.room.stay_type)}
                </span>
              )}
              {order.reviewed && <span className="badge badge-ghost badge-sm">리뷰 완료</span>}
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-base-content/50">
                <span>예약일: {orderDate}</span>
                {order.selectedTime && <span>입실 {order.selectedTime}</span>}
                {order.duration?.hours && <span>{order.duration.hours}시간</span>}
              </div>
              <span className="text-lg font-bold">{order.used_points.toLocaleString()}P</span>
            </div>
            {order.cancel_reason && (
              <p className="mt-1 text-xs text-error">취소 사유: {order.cancel_reason}</p>
            )}
          </div>

          {/* 오른쪽 버튼 */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            {order.payment_status === "completed" && (
              <div className="flex flex-col gap-1">
                {canReview && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <Pencil className="size-3.5" />
                    리뷰 작성
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => setShowCancelModal(true)}
                >
                  예약 취소
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 리뷰 모달 */}
      {showReviewModal && <ReviewModal order={order} onClose={() => setShowReviewModal(false)} />}

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
