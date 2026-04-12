"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Accommodation } from "@/types/accommodation"
import type { SearchParams } from "@/types/search"

async function fetchAccommodations(params: SearchParams): Promise<Accommodation[]> {
  const constraints = [where("location.city", "==", params.city)]

  if (params.subCity) {
    constraints.push(where("location.sub_city", "==", params.subCity))
  }

  const q = query(collection(db, "accommodations"), ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Accommodation, "id">),
  }))
}

export function useAccommodationsQuery(params: SearchParams | null) {
  return useQuery({
    queryKey: ["accommodations", params],
    queryFn: () => fetchAccommodations(params!),
    enabled: !!params,
  })
}
