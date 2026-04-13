"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Review } from "@/types/review"

async function fetchReviews(lodgingId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("lodging_id", "==", lodgingId),
    orderBy("created_at", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Review, "id">),
  }))
}

export function useReviewsQuery(lodgingId: string | null) {
  return useQuery({
    queryKey: ["reviews", lodgingId],
    queryFn: () => fetchReviews(lodgingId!),
    enabled: !!lodgingId,
  })
}
