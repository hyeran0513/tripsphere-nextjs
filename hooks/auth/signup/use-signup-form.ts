"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { useSignUpMutation } from "@/hooks/mutations/use-signup-mutation"
import { getFirebaseErrorMessage } from "@/lib/firebase/firebase-error-message"
import { signUpSchema, type SignUpSchema } from "@/schemas/auth.schema"

export function useSignUpForm() {
  const router = useRouter()
  const signUpMutation = useSignUpMutation()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: SignUpSchema) => {
    try {
      await signUpMutation.mutateAsync(values)
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
    isPending: signUpMutation.isPending,
  }
}
