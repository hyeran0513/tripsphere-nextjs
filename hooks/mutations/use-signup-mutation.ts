"use client"

import { useMutation } from "@tanstack/react-query"
import { createUserWithEmailAndPassword } from "firebase/auth"

import { auth } from "@/lib/firebase/client"
import { getFirebaseErrorMessage } from "@/lib/firebase/firebase-error-message"
import type { SignUpSchema } from "@/schemas/auth.schema"

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (values: SignUpSchema) => {
      const { email, password } = values
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    },
    onError: (error) => {
      console.error(getFirebaseErrorMessage(error))
    },
  })
}
