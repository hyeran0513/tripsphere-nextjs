"use client"

import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Room } from "@/types/room"

async function fetchRoom(id: string): Promise<Room> {
  const snap = await getDoc(doc(db, "public_rooms", id))
  if (!snap.exists()) throw new Error("객실을 찾을 수 없습니다.")
  return { id: snap.id, ...(snap.data() as Omit<Room, "id">) }
}

export function useRoomDetailQuery(id: string | null) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => fetchRoom(id!),
    enabled: !!id,
  })
}
