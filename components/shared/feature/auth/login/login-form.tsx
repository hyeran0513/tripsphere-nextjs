"use client"

import { CircleAlert, Mail } from "lucide-react"
import Link from "next/link"

import { InputField } from "@/components/shared/form/input-field"
import { PasswordField } from "@/components/shared/form/password-field"
import { PATH } from "@/constants/path"
import { useLoginForm } from "@/hooks/auth/login/use-login-form"

export function LoginForm() {
  const { form, onSubmit, isPending } = useLoginForm()

  return (
    <div className="card w-full max-w-md border border-base-300/80 bg-base-100">
      <div className="card-body gap-6 p-6 sm:p-8">
        <Link href={PATH.HOME} className="flex items-center text-2xl font-bold">
          <span className="text-primary">TRIP</span>SPHERE
        </Link>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset className="fieldset space-y-4">
            {/* 이메일 입력 필드 */}
            <InputField
              control={form.control}
              name="email"
              label="이메일"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              id="login-email"
              icon={Mail}
              disabled={isPending}
            />

            {/* 비밀번호 입력 필드 */}
            <PasswordField
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              id="login-password"
              disabled={isPending}
            />
          </fieldset>

          {/* 로그인 오류 메시지 */}
          {form.formState.errors.root ? (
            <div className="alert alert-error text-sm" role="alert">
              <CircleAlert className="size-5 shrink-0" aria-hidden />
              <span>{form.formState.errors.root.message}</span>
            </div>
          ) : null}

          {/* 로그인 버튼 */}
          <div className="card-actions flex-col gap-3 pt-1">
            <button
              type="submit"
              className={`btn btn-primary btn-block h-11 text-base ${isPending ? "loading" : ""}`}
              disabled={isPending}
            >
              {isPending ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        {/* 구분선 */}
        <div className="divider text-base-content/50 my-0 text-xs">또는</div>

        {/* 회원가입 링크 */}
        <p className="text-center text-sm text-base-content/70">
          계정이 없으신가요?{" "}
          <Link href={PATH.SIGNUP} className="font-medium text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
