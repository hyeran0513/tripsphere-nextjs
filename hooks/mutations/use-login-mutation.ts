"use client"

import { useMutation } from "@tanstack/react-query"
import { signInWithEmailAndPassword } from "firebase/auth"

import { auth } from "@/lib/firebase/client"
import type { LoginSchema } from "@/schemas/auth.schema"

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (values: LoginSchema) => {
      const { email, password } = values
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    },
  })
}
