"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, limit } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Lodging } from "@/types/lodging"

async function fetchCityLodgings(city: string): Promise<Lodging[]> {
  const q = query(collection(db, "public_lodgings"), where("location.city", "==", city), limit(12))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Lodging, "id">),
  }))
}

export function useCityLodgingsQuery(city: string) {
  return useQuery({
    queryKey: ["lodgings", "city", city],
    queryFn: () => fetchCityLodgings(city),
  })
}
