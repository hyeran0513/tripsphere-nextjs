"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { useLoginMutation } from "@/hooks/mutations/use-login-mutation"
import { getFirebaseErrorMessage } from "@/lib/firebase/firebase-error-message"
import { loginSchema, type LoginSchema } from "@/schemas/auth.schema"

export function useLoginForm() {
  const router = useRouter()
  const loginMutation = useLoginMutation()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    try {
      await loginMutation.mutateAsync(values)
      router.push("/")
    } catch (error) {
      form.setError("root", {
        message: getFirebaseErrorMessage(error),
      })
    }
  }

  return {
    form,
    onSubmit,
    isPending: loginMutation.isPending,
  }
}
