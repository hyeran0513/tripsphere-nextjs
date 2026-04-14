"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Room } from "@/types/room"

async function fetchRooms(accommodationId: string): Promise<Room[]> {
  const q = query(collection(db, "public_rooms"), where("accommodation_id", "==", accommodationId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Room, "id">),
  }))
}

export function useRoomsQuery(accommodationId: string | null) {
  return useQuery({
    queryKey: ["rooms", accommodationId],
    queryFn: () => fetchRooms(accommodationId!),
    enabled: !!accommodationId,
  })
}
