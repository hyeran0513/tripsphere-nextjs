"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Lodging } from "@/types/lodging"
import type { SearchParams } from "@/types/search"

async function fetchLodgings(params: SearchParams): Promise<Lodging[]> {
  const constraints = [where("location.city", "==", params.city)]

  if (params.subCity) {
    constraints.push(where("location.sub_city", "==", params.subCity))
  }

  const q = query(collection(db, "public_lodgings"), ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Lodging, "id">),
  }))
}

export function useLodgingsQuery(params: SearchParams | null) {
  return useQuery({
    queryKey: ["lodgings", params],
    queryFn: () => fetchLodgings(params!),
    enabled: !!params,
  })
}
