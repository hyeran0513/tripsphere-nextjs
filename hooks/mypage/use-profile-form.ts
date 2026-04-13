"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useUpdateUserMutation } from "@/hooks/mutations/use-user-mutation"
import { profileSchema, type ProfileSchema } from "@/schemas/profile.schema"

type UseProfileFormParams = {
  userId: string
  defaultValues: ProfileSchema
}

export function useProfileForm({ userId, defaultValues }: UseProfileFormParams) {
  const updateUser = useUpdateUserMutation()
  const [saved, setSaved] = useState(false)

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  const onSubmit = async (values: ProfileSchema) => {
    await updateUser.mutateAsync({ userId, ...values })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return {
    form,
    onSubmit,
    isPending: updateUser.isPending,
    saved,
  }
}
