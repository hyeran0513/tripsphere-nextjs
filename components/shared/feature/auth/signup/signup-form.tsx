"use client"

import { CircleAlert, Mail, Phone, ShieldCheck, User } from "lucide-react"
import Link from "next/link"

import { InputField } from "@/components/shared/form/input-field"
import { PasswordField } from "@/components/shared/form/password-field"
import { PATH } from "@/constants/path"
import { useSignUpForm } from "@/hooks/auth/signup/use-signup-form"

export function SignUpForm() {
  const { form, onSubmit, isPending } = useSignUpForm()

  return (
    <div className="card w-full max-w-md border border-base-300/80 bg-base-100">
      <div className="card-body gap-6 p-6 sm:p-8">
        <Link href={PATH.HOME} className="flex items-center text-2xl font-bold">
          <span className="text-primary">TRIP</span>SPHERE
        </Link>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset className="fieldset space-y-4">
            <InputField
              control={form.control}
              name="email"
              label="이메일"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              id="signup-email"
              icon={Mail}
              disabled={isPending}
            />

            <PasswordField
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              id="signup-password"
              disabled={isPending}
            />

            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              id="signup-confirm-password"
              icon={ShieldCheck}
              disabled={isPending}
            />

            <InputField
              control={form.control}
              name="nickname"
              label="닉네임"
              placeholder="닉네임을 입력하세요"
              id="signup-nickname"
              icon={User}
              disabled={isPending}
            />

            <InputField
              control={form.control}
              name="username"
              label="이름"
              placeholder="이름을 입력하세요"
              id="signup-username"
              icon={User}
              disabled={isPending}
            />

            <InputField
              control={form.control}
              name="phone"
              label="전화번호"
              type="tel"
              placeholder="010-1234-5678"
              autoComplete="tel"
              id="signup-phone"
              icon={Phone}
              disabled={isPending}
            />
          </fieldset>

          {form.formState.errors.root ? (
            <div className="alert alert-error text-sm" role="alert">
              <CircleAlert className="size-5 shrink-0" aria-hidden />
              <span>{form.formState.errors.root.message}</span>
            </div>
          ) : null}

          <div className="card-actions flex-col gap-3 pt-1">
            <button
              type="submit"
              className={`btn btn-primary btn-block h-11 text-base ${isPending ? "loading" : ""}`}
              disabled={isPending}
            >
              {isPending ? "가입 중..." : "회원가입"}
            </button>
          </div>
        </form>

        <div className="divider text-base-content/50 my-0 text-xs">또는</div>

        <p className="text-center text-sm text-base-content/70">
          이미 계정이 있으신가요?{" "}
          <Link href={PATH.LOGIN} className="link link-primary font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
