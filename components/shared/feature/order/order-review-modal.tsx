"use client"

import { useState } from "react"
import { Star } from "lucide-react"

import { Modal } from "@/components/ui/modal"
import type { OrderWithDetails } from "@/hooks/queries/use-orders-query"
import { useCreateReviewMutation } from "@/hooks/mutations/use-review-mutation"

type OrderReviewModalProps = {
  order: OrderWithDetails
  onClose: () => void
}

export function OrderReviewModal({ order, onClose }: OrderReviewModalProps) {
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
    <Modal open onClose={onClose}>
      <h3 className="text-lg font-bold">리뷰 작성</h3>
      <p className="mt-1 text-sm text-base-content/60">
        {order.room?.accommodation_name} · {order.room?.name}
      </p>

      {/* 별점 */}
      <div className="mt-4">
        {/* 별점 라벨 */}
        <label className="label">
          <span className="label-text font-medium">별점</span>
        </label>

        {/* 별점 선택 버튼 */}
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
        {/* 내용 라벨 */}
        <label className="label" htmlFor="reviewComment">
          <span className="label-text font-medium">리뷰 내용</span>
        </label>

        {/* 리뷰 내용 입력 필드 */}
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
        {/* 닫기 버튼 */}
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          닫기
        </button>

        {/* 리뷰 등록 버튼 */}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={!comment.trim() || createReview.isPending}
          onClick={handleSubmit}
        >
          {createReview.isPending ? "작성 중..." : "리뷰 등록"}
        </button>
      </div>
    </Modal>
  )
}
