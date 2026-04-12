"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { City } from "@/types/city"

async function fetchCities(): Promise<City[]> {
  const snapshot = await getDocs(collection(db, "cities"))

  const cities = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<City, "id">),
  }))

  return cities.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  })
}
