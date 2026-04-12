"use client"

import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"

export type Term = {
  id: string
  title: string
  description: string
}

async function fetchTerms(): Promise<Term[]> {
  const snapshot = await getDocs(collection(db, "terms"))
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Term, "id">),
  }))
}

async function fetchTerm(termId: string): Promise<Term | null> {
  const snap = await getDoc(doc(db, "terms", termId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Term, "id">) }
}

export function useTermsQuery() {
  return useQuery({
    queryKey: ["terms"],
    queryFn: fetchTerms,
  })
}

export function useTermQuery(termId: string | null) {
  return useQuery({
    queryKey: ["terms", termId],
    queryFn: () => fetchTerm(termId!),
    enabled: !!termId,
  })
}
