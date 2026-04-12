"use client"

import { onAuthStateChanged, type User } from "firebase/auth"
import { useEffect, useState } from "react"

import { auth } from "@/lib/firebase/client"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, isLoading }
}
