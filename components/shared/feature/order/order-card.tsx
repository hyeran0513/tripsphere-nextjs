"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { format } from "date-fns"

import { Modal } from "@/components/ui/modal"
import { getLodgingTypeLabel } from "@/types/lodging"
import type { OrderWithDetails } from "@/hooks/queries/use-orders-query"
import { useCancelOrderMutation } from "@/hooks/mutations/use-order-mutation"
import { OrderReviewModal } from "@/components/shared/feature/order/order-review-modal"
import { ORDER_STATUS_LABEL } from "@/constants/order/order"

type OrderCardProps = {
  order: OrderWithDetails
}

export function OrderCard({ order }: OrderCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const cancelOrder = useCancelOrderMutation()

  const status = ORDER_STATUS_LABEL[order.payment_status] ?? ORDER_STATUS_LABEL.pending
  const orderDate = format(new Date(order.order_date), "yyyy.MM.dd HH:mm")
  const canReview = order.payment_status === "completed" && !order.reviewed

  // 예약 취소 핸들러
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
        {/* 이미지 */}
        <figure className="relative min-h-32 w-40 shrink-0 sm:min-h-36 sm:w-52">
          {(order.room?.image ?? order.lodging?.image) ? (
            <Image
              src={(order.room?.image ?? order.lodging?.image)!}
              alt={order.lodging?.name ?? "숙소"}
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

        {/* 정보 */}
        <div className="flex flex-1 items-center justify-between gap-4 p-4">
          <div className="flex flex-col gap-1">
            {/* 숙소 이름과 상태 배지 */}
            <h3 className="text-base font-semibold">{order.lodging?.name ?? "숙소 정보 없음"}</h3>

            {/* 객실 이름 */}
            {order.room?.name && <p className="text-sm text-base-content/60">{order.room.name}</p>}

            <div className="flex flex-wrap items-center gap-2">
              {/* 상태 배지 */}
              <span className={`badge badge-sm ${status.className}`}>{status.text}</span>

              {/* 숙소 유형 배지 */}
              {order.lodging?.type && (
                <span className="badge badge-outline badge-sm">
                  {getLodgingTypeLabel(order.lodging.type)}
                </span>
              )}

              {/* 객실 타입 배지 */}
              {order.room?.type && (
                <span className="badge badge-outline badge-sm">{order.room.type}</span>
              )}

              {/* 리뷰 완료 배지 */}
              {order.reviewed && <span className="badge badge-ghost badge-sm">리뷰 완료</span>}
            </div>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-base-content/50">
                {/* 예약일 */}
                <span>예약일: {orderDate}</span>
              </div>
              <span className="text-lg font-bold">{order.used_points.toLocaleString()}P</span>
            </div>

            {/* 취소 사유 */}
            {order.cancel_reason && (
              <p className="mt-1 text-xs text-error">취소 사유: {order.cancel_reason}</p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {order.payment_status === "completed" && (
              <div className="flex flex-col gap-1">
                {/* 리뷰 작성 버튼 */}
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

                {/* 예약 취소 버튼 */}
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
      {showReviewModal && (
        <OrderReviewModal order={order} onClose={() => setShowReviewModal(false)} />
      )}

      {/* 취소 모달 */}
      <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <h3 className="text-lg font-bold">예약 취소</h3>

        <p className="mt-2 text-sm text-base-content/70">
          정말 예약을 취소하시겠습니까? {order.used_points.toLocaleString()}P가 환불됩니다.
        </p>

        <div className="form-control mt-4">
          {/* 취소 사유 라벨 */}
          <label className="label" htmlFor="cancelReason">
            <span className="label-text">취소 사유 (선택)</span>
          </label>

          {/* 취소 사유 입력 필드 */}
          <textarea
            id="cancelReason"
            className="textarea textarea-bordered w-full"
            placeholder="취소 사유를 입력해주세요"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>

        <div className="modal-action">
          {/* 닫기 버튼 */}
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

          {/* 예약 취소 확정 버튼 */}
          <button
            type="button"
            className="btn btn-error btn-sm"
            disabled={cancelOrder.isPending}
            onClick={handleCancel}
          >
            {cancelOrder.isPending ? "취소 중..." : "예약 취소"}
          </button>
        </div>
      </Modal>
    </>
  )
}
