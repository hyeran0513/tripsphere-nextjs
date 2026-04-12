import { Suspense } from "react"

import { SignUpForm } from "@/components/shared/feature/auth/signup/signup-form"
import { SignupFallback } from "@/components/shared/feature/auth/signup/signup-fallback"

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignUpForm />
    </Suspense>
  )
}
