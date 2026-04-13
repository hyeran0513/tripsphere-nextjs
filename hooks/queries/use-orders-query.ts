"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Order } from "@/types/order"
import type { Lodging } from "@/types/lodging"

export type OrderWithDetails = Order & {
  lodging?: {
    name: string
    image?: string
    type?: string
    price_point: number
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
        lodging_id: data.lodging_id,
        user_id: data.user_id,
        order_date: data.order_date,
        payment_status: data.payment_status,
        used_points: data.used_points,
        cancel_reason: data.cancel_reason,
        reviewed: data.reviewed ?? false,
      }

      try {
        const lodgingSnap = await getDoc(doc(db, "public_lodgings", data.lodging_id))
        if (lodgingSnap.exists()) {
          const lodgingData = lodgingSnap.data() as Omit<Lodging, "id">
          order.lodging = {
            name: lodgingData.name,
            image: lodgingData.images?.[0],
            type: lodgingData.type,
            price_point: lodgingData.price_point,
          }
        }
      } catch {
        // 숙소 정보를 가져오지 못해도 예약은 표시
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
