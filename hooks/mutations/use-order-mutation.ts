"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"

type CreateOrderParams = {
  lodging_id: string
  room_id: string
  user_id: string
  used_points: number
}

async function createOrder(params: CreateOrderParams) {
  // 예약 생성
  const orderRef = await addDoc(collection(db, "orders"), {
    lodging_id: params.lodging_id,
    room_id: params.room_id,
    user_id: params.user_id,
    order_date: new Date().toISOString(),
    payment_status: "completed",
    used_points: params.used_points,
  })

  // 포인트 차감
  await addDoc(collection(db, "points"), {
    user_id: params.user_id,
    title: "숙소 결제",
    description: "숙소 예약 결제",
    points: params.used_points,
    type: "used",
    received_date: new Date().toISOString(),
  })

  return orderRef.id
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["points", variables.user_id],
      })
      queryClient.invalidateQueries({
        queryKey: ["cart", variables.user_id],
      })
    },
  })
}

type CancelOrderParams = {
  order_id: string
  user_id: string
  used_points: number
  cancel_reason?: string
}

async function cancelOrder(params: CancelOrderParams) {
  // 예약 상태 변경
  await updateDoc(doc(db, "orders", params.order_id), {
    payment_status: "cancelled",
    cancel_reason: params.cancel_reason ?? null,
  })

  // 포인트 환불
  await addDoc(collection(db, "points"), {
    user_id: params.user_id,
    title: "예약 취소 환불",
    description: "예약 취소로 인한 포인트 환불",
    points: params.used_points,
    type: "add",
    received_date: new Date().toISOString(),
  })
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.user_id],
      })
      queryClient.invalidateQueries({
        queryKey: ["points", variables.user_id],
      })
    },
  })
}
