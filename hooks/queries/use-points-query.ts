"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Point } from "@/types/point"

async function fetchPoints(userId: string): Promise<Point[]> {
  const q = query(collection(db, "points"), where("user_id", "==", userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Point, "id">),
  }))
}

export function usePointsQuery(userId: string | null) {
  return useQuery({
    queryKey: ["points", userId],
    queryFn: () => fetchPoints(userId!),
    enabled: !!userId,
  })
}

export function calculateAvailablePoints(points: Point[]): number {
  return points.reduce((sum, p) => {
    return p.type === "add" ? sum + p.points : sum - p.points
  }, 0)
}
