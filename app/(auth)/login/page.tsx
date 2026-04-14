import { LoginForm } from "@/components/shared/feature/auth/login/login-form"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "로그인 | TripSphere",
}

export default function LoginPage() {
  return (
    <PageBoundary>
      <LoginForm />
    </PageBoundary>
  )
}
