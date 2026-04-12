"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Review } from "@/types/review"

async function fetchReviews(accommodationId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("accommodation_id", "==", accommodationId),
    orderBy("created_at", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Review, "id">),
  }))
}

export function useReviewsQuery(accommodationId: string | null) {
  return useQuery({
    queryKey: ["reviews", accommodationId],
    queryFn: () => fetchReviews(accommodationId!),
    enabled: !!accommodationId,
  })
}
