"use client"

import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Accommodation } from "@/types/accommodation"

async function fetchAccommodation(id: string): Promise<Accommodation> {
  const snap = await getDoc(doc(db, "accommodations", id))
  if (!snap.exists()) throw new Error("숙소를 찾을 수 없습니다.")
  return { id: snap.id, ...(snap.data() as Omit<Accommodation, "id">) }
}

export function useAccommodationDetailQuery(id: string | null) {
  return useQuery({
    queryKey: ["accommodation", id],
    queryFn: () => fetchAccommodation(id!),
    enabled: !!id,
  })
}
