import { SignUpForm } from "@/components/shared/feature/auth/signup/signup-form"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "회원가입 | TripSphere",
}

export default function SignupPage() {
  return (
    <PageBoundary>
      <SignUpForm />
    </PageBoundary>
  )
}
