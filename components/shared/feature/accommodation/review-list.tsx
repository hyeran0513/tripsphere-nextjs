"use client"

import { Star } from "lucide-react"

import type { Review } from "@/types/review"

type ReviewListProps = {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="py-8 text-center text-sm text-base-content/50">아직 리뷰가 없습니다.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-base-300 bg-base-100 p-4">
          <div className="flex items-center gap-2">
            {/* 별점 */}
            <div className="flex items-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < review.rating ? "fill-current" : "text-base-300"}`}
                />
              ))}
            </div>

            {/* 작성 날짜 */}
            <span className="text-sm text-base-content/50">
              {new Date(review.created_at).toLocaleDateString("ko-KR")}
            </span>
          </div>

          {/* 리뷰 내용 */}
          <p className="mt-2 text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
