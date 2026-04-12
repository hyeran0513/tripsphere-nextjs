"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"

type CreateReviewParams = {
  accommodation_id: string
  user_id: string
  order_id: string
  rating: number
  comment: string
}

async function createReview(params: CreateReviewParams) {
  // 리뷰 생성
  await addDoc(collection(db, "reviews"), {
    accommodation_id: params.accommodation_id,
    user_id: params.user_id,
    rating: params.rating,
    comment: params.comment,
    created_at: new Date().toISOString(),
  })

  // 주문에 리뷰 작성 완료 표시
  await updateDoc(doc(db, "orders", params.order_id), {
    reviewed: true,
  })
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.accommodation_id],
      })
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.user_id],
      })
    },
  })
}
