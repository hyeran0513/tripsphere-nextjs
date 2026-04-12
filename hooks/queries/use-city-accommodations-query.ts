"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where, limit } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Accommodation } from "@/types/accommodation"

async function fetchCityAccommodations(city: string): Promise<Accommodation[]> {
  const q = query(collection(db, "accommodations"), where("location.city", "==", city), limit(12))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Accommodation, "id">),
  }))
}

export function useCityAccommodationsQuery(city: string) {
  return useQuery({
    queryKey: ["accommodations", "city", city],
    queryFn: () => fetchCityAccommodations(city),
  })
}
