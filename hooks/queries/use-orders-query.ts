"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Order } from "@/types/order"
import type { Room } from "@/types/room"
import type { Accommodation } from "@/types/accommodation"

export type OrderWithDetails = Order & {
  room?: {
    name: string
    image?: string
    accommodation_id: string
    accommodation_name?: string
    original_price: number
    discount_rate: number
    stay_type: string
  }
}

async function fetchOrders(userId: string): Promise<OrderWithDetails[]> {
  const q = query(
    collection(db, "orders"),
    where("user_id", "==", userId),
    orderBy("order_date", "desc")
  )
  const snapshot = await getDocs(q)

  const orders = await Promise.all(
    snapshot.docs.map(async (orderDoc) => {
      const data = orderDoc.data()
      const order: OrderWithDetails = {
        id: orderDoc.id,
        room_id: data.room_id,
        user_id: data.user_id,
        order_date: data.order_date,
        payment_status: data.payment_status,
        used_points: data.used_points,
        cancel_reason: data.cancel_reason,
        selectedTime: data.selectedTime,
        duration: data.duration,
      }

      try {
        const roomSnap = await getDoc(doc(db, "rooms", data.room_id))
        if (roomSnap.exists()) {
          const roomData = roomSnap.data() as Omit<Room, "id">
          const accSnap = await getDoc(doc(db, "accommodations", roomData.accommodation_id))
          const accData = accSnap.exists() ? (accSnap.data() as Omit<Accommodation, "id">) : null

          order.room = {
            name: roomData.name,
            image: roomData.images?.[0] ?? accData?.images?.[0],
            accommodation_id: roomData.accommodation_id,
            accommodation_name: accData?.name,
            original_price: roomData.original_price,
            discount_rate: roomData.discount_rate,
            stay_type: roomData.stay_type,
          }
        }
      } catch {
        // 객실 정보를 가져오지 못해도 주문은 표시
      }

      return order
    })
  )

  return orders
}

export function useOrdersQuery(userId: string | null) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId!),
    enabled: !!userId,
  })
}
