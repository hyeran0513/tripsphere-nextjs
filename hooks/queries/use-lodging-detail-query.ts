"use client"

import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Lodging } from "@/types/lodging"

async function fetchLodging(id: string): Promise<Lodging> {
  const snap = await getDoc(doc(db, "public_lodgings", id))
  if (!snap.exists()) throw new Error("숙소를 찾을 수 없습니다.")
  return { id: snap.id, ...(snap.data() as Omit<Lodging, "id">) }
}

export function useLodgingDetailQuery(id: string | null) {
  return useQuery({
    queryKey: ["lodging", id],
    queryFn: () => fetchLodging(id!),
    enabled: !!id,
  })
}
