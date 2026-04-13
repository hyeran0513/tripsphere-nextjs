"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User as FirebaseUser } from "firebase/auth"
import { Check, User, Phone } from "lucide-react"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useUserQuery, type UserProfile } from "@/hooks/queries/use-user-query"
import { useUpdateUserMutation } from "@/hooks/mutations/use-user-mutation"

type ProfileFormFieldsProps = {
  user: FirebaseUser
  profile: UserProfile | null | undefined
}

function ProfileFormFields({ user, profile }: ProfileFormFieldsProps) {
  const updateUser = useUpdateUserMutation()

  const [nickname, setNickname] = useState(() => profile?.nickname ?? "")
  const [username, setUsername] = useState(() => profile?.username ?? "")
  const [phone, setPhone] = useState(() => profile?.phone ?? "")
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await updateUser.mutateAsync({
      userId: user.uid,
      nickname,
      username,
      phone,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">회원정보 수정</h2>

      <form onSubmit={handleSubmit} className="card w-full border border-base-300 bg-base-100">
        <div className="card-body gap-4">
          {/* 이메일 */}
          <div className="form-control">
            {/* 이메일 라벨 */}
            <label className="label">
              <span className="label-text font-medium">이메일</span>
            </label>

            {/* 이메일 입력 필드 */}
            <input
              type="email"
              className="input input-bordered w-full bg-base-200"
              value={profile?.email ?? user.email ?? ""}
              disabled
            />
          </div>

          {/* 닉네임 */}
          <div className="form-control">
            {/* 닉네임 라벨 */}
            <label className="label" htmlFor="profile-nickname">
              <span className="label-text font-medium">닉네임</span>
            </label>

            {/* 닉네임 입력 필드 */}
            <div className="input input-bordered flex w-full items-center gap-2">
              <User className="size-4 text-base-content/40" />
              <input
                id="profile-nickname"
                type="text"
                className="min-w-0 grow bg-transparent outline-none"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>
          </div>

          {/* 이름 */}
          <div className="form-control">
            {/* 이름 라벨 */}
            <label className="label" htmlFor="profile-username">
              <span className="label-text font-medium">이름</span>
            </label>

            {/* 이름 입력 필드 */}
            <div className="input input-bordered flex w-full items-center gap-2">
              <User className="size-4 text-base-content/40" />
              <input
                id="profile-username"
                type="text"
                className="min-w-0 grow bg-transparent outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
          </div>

          {/* 전화번호 */}
          <div className="form-control">
            {/* 전화번호 라벨 */}
            <label className="label" htmlFor="profile-phone">
              <span className="label-text font-medium">전화번호</span>
            </label>

            {/* 전화번호 입력 필드 */}
            <div className="input input-bordered flex w-full items-center gap-2">
              <Phone className="size-4 text-base-content/40" />
              <input
                id="profile-phone"
                type="tel"
                className="min-w-0 grow bg-transparent outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <button type="submit" className="btn btn-primary mt-2" disabled={updateUser.isPending}>
            {updateUser.isPending ? "저장 중..." : "저장"}
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
