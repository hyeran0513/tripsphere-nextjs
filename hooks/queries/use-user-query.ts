"use client"

import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"

export type UserProfile = {
  email: string
  nickname: string
  username: string
  phone: string
  profile_image: string
  points: number
  createdAt: string
}

async function fetchUser(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", userId))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

export function useUserQuery(userId: string | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  })
}
