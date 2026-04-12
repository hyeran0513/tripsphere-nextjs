"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"

type UpdateUserParams = {
  userId: string
  nickname: string
  username: string
  phone: string
}

async function updateUser({ userId, ...data }: UpdateUserParams) {
  await updateDoc(doc(db, "users", userId), data)
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
      })
    },
  })
}
