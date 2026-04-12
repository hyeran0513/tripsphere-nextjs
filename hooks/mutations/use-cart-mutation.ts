"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"

type AddToCartParams = {
  room_id: string
  user_id: string
}

async function addToCart(params: AddToCartParams) {
  const docRef = await addDoc(collection(db, "carts"), {
    room_id: params.room_id,
    user_id: params.user_id,
    created_at: new Date().toISOString(),
  })
  return docRef.id
}

async function removeFromCart(cartId: string) {
  await deleteDoc(doc(db, "carts", cartId))
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.user_id] })
    },
  })
}

export function useRemoveFromCartMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] })
    },
  })
}
