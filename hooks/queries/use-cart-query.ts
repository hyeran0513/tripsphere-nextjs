"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { CartItem } from "@/types/cart"
import type { Room } from "@/types/room"
import type { Accommodation } from "@/types/accommodation"

async function fetchCart(userId: string): Promise<CartItem[]> {
  const q = query(collection(db, "carts"), where("user_id", "==", userId))
  const snapshot = await getDocs(q)

  const items = await Promise.all(
    snapshot.docs.map(async (cartDoc) => {
      const data = cartDoc.data()
      const item: CartItem = {
        id: cartDoc.id,
        room_id: data.room_id,
        user_id: data.user_id,
        created_at: data.created_at,
      }

      // 객실 정보 조인
      try {
        const roomSnap = await getDoc(doc(db, "rooms", data.room_id))
        if (roomSnap.exists()) {
          const roomData = roomSnap.data() as Omit<Room, "id">
          const accSnap = await getDoc(doc(db, "accommodations", roomData.accommodation_id))
          const accData = accSnap.exists() ? (accSnap.data() as Omit<Accommodation, "id">) : null

          item.room = {
            name: roomData.name,
            price_per_hour: roomData.price_per_hour,
            price_per_night: roomData.price_per_night,
            accommodation_name: accData?.name,
            image: roomData.images?.[0] ?? accData?.images?.[0],
          }
        }
      } catch {
        // 객실 정보를 가져오지 못해도 장바구니 아이템은 표시
      }

      return item
    })
  )

  return items
}

export function useCartQuery(userId: string | null) {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => fetchCart(userId!),
    enabled: !!userId,
  })
}
