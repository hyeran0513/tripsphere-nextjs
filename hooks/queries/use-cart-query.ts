"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { CartItem } from "@/types/cart"
import type { Lodging } from "@/types/lodging"

async function fetchCart(userId: string): Promise<CartItem[]> {
  const q = query(collection(db, "carts"), where("user_id", "==", userId))
  const snapshot = await getDocs(q)

  const items = await Promise.all(
    snapshot.docs.map(async (cartDoc) => {
      const data = cartDoc.data()
      const item: CartItem = {
        id: cartDoc.id,
        lodging_id: data.lodging_id,
        user_id: data.user_id,
        created_at: data.created_at,
      }

      try {
        const lodgingSnap = await getDoc(doc(db, "public_lodgings", data.lodging_id))
        if (lodgingSnap.exists()) {
          const lodgingData = lodgingSnap.data() as Omit<Lodging, "id">
          item.lodging = {
            name: lodgingData.name,
            type: lodgingData.type,
            image: lodgingData.images?.[0],
          }
        }
      } catch {
        // 숙소 정보를 가져오지 못해도 장바구니 아이템은 표시
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
