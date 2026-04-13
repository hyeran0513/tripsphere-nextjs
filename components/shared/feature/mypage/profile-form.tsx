"use client"

import { useRouter } from "next/navigation"
import type { User as FirebaseUser } from "firebase/auth"
import { Check, Phone, User } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useUserQuery, type UserProfile } from "@/hooks/queries/use-user-query"
import { useProfileForm } from "@/hooks/mypage/use-profile-form"
import { InputField } from "@/components/shared/form/input-field"

type ProfileFormFieldsProps = {
  user: FirebaseUser
  profile: UserProfile | null | undefined
}

function ProfileFormFields({ user, profile }: ProfileFormFieldsProps) {
  const { form, onSubmit, isPending, saved } = useProfileForm({
    userId: user.uid,
    defaultValues: {
      nickname: profile?.nickname ?? "",
      username: profile?.username ?? "",
      phone: profile?.phone ?? "",
    },
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">회원정보 수정</h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="card w-full border border-base-300 bg-base-100"
      >
        <div className="card-body gap-4">
          {/* 이메일 */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium">이메일</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full bg-base-200"
              value={profile?.email ?? user.email ?? ""}
              disabled
            />
          </div>

          {/* 닉네임 입력 필드 */}
          <InputField
            control={form.control}
            name="nickname"
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            id="profile-nickname"
            icon={User}
            disabled={isPending}
          />

          {/* 이름 입력 필드 */}
          <InputField
            control={form.control}
            name="username"
            label="이름"
            placeholder="이름을 입력하세요"
            id="profile-username"
            icon={User}
            disabled={isPending}
          />

          {/* 전화번호 입력 필드 */}
          <InputField
            control={form.control}
            name="phone"
            type="tel"
            label="전화번호"
            placeholder="010-1234-5678"
            id="profile-phone"
            icon={Phone}
            disabled={isPending}
          />

          {/* 저장 버튼 */}
          <button type="submit" className="btn btn-primary mt-2" disabled={isPending}>
            {isPending ? "저장 중..." : "저장"}
          </button>

          {/* 저장 완료 메시지 */}
          {saved && (
            <div className="alert alert-success text-sm">
              <Check className="size-4" />
              <span>저장되었습니다.</span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export function ProfileForm() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: profile, isLoading } = useUserQuery(user?.uid ?? null)

  if (authLoading || isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-48 w-full rounded-lg" />
      </div>
    )
  }

  if (!user) {
    router.push(PATH.LOGIN)
    return null
  }

  return <ProfileFormFields key={user.uid} user={user} profile={profile} />
}
