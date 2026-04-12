"use client"

import { useMutation } from "@tanstack/react-query"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

import { auth, db } from "@/lib/firebase/client"
import { getFirebaseErrorMessage } from "@/lib/firebase/firebase-error-message"
import type { SignUpSchema } from "@/schemas/auth.schema"

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (values: SignUpSchema) => {
      const { email, password, nickname, username, phone } = values
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Firestore users 컬렉션에 유저 정보 저장
      await setDoc(doc(db, "users", result.user.uid), {
        email,
        nickname,
        username,
        phone,
        profile_image: "",
        points: 0,
        cart: [],
        orders: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      })

      return result.user
    },
    onError: (error) => {
      console.error(getFirebaseErrorMessage(error))
    },
  })
}
