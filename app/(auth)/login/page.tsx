import { Suspense } from "react"

import { LoginForm } from "@/components/shared/feature/auth/login-form"
import { LoginFallback } from "@/components/shared/feature/auth/login-fallback"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
