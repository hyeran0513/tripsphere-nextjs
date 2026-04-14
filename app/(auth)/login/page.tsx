import { Suspense } from "react"

import { LoginForm } from "@/components/shared/feature/auth/login/login-form"
import { PageBoundary } from "@/components/ui/page-boundary"

export default function LoginPage() {
  return (
    <PageBoundary>
      <LoginForm />
    </PageBoundary>
  )
}
