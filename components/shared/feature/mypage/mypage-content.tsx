"use client"

import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { LogOut } from "lucide-react"
import Link from "next/link"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useUserQuery } from "@/hooks/queries/use-user-query"
import { usePointsQuery, calculateAvailablePoints } from "@/hooks/queries/use-points-query"
import { auth } from "@/lib/firebase/client"
import { MENU_ITEMS } from "@/constants/mypage/menu-items"

export function MypageContent() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: profile, isLoading } = useUserQuery(user?.uid ?? null)
  const { data: points } = usePointsQuery(user?.uid ?? null)

  const availablePoints = points ? calculateAvailablePoints(points) : 0

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await signOut(auth)
    router.push(PATH.HOME)
  }

  // 로딩 중일 때 스케쥴러 표시
  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <div className="skeleton h-32 w-full rounded-lg" />
        <div className="skeleton h-64 w-full rounded-lg" />
      </div>
    )
  }

  // 로그인 안 되어 있을 때 로그인 페이지로 이동
  if (!user) {
    router.push(PATH.LOGIN)
    return null
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      {/* 프로필 카드 */}
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body flex-row items-center gap-4">
          {/* 프로필 이미지 또는 이니셜 */}
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-content">
            {(profile?.nickname ?? user.email)?.[0]?.toUpperCase()}
          </div>

          <div className="flex-1">
            {/* 사용자 이름 또는 닉네임 */}
            <h2 className="text-xl font-bold">
              {profile?.nickname ?? user.displayName ?? "사용자"}
            </h2>

            {/* 이메일 주소 */}
            <p className="text-sm text-base-content/60">{profile?.email ?? user.email}</p>

            {/* 사용자 이름 */}
            {profile?.username && (
              <p className="text-sm text-base-content/50">{profile.username}</p>
            )}
          </div>

          {/* 숙소 예약 가능 포인트 */}
          <div className="text-right">
            <p className="text-xs text-base-content/50">보유 포인트</p>
            <p className="text-xl font-bold text-primary">{availablePoints.toLocaleString()}P</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body p-0">
          <ul className="menu w-full p-2">
            {/* 메뉴 항목 */}
            {MENU_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-3 py-4">
                  <item.icon className="size-5" />
                  <span className="text-base">{item.label}</span>
                </Link>
              </li>
            ))}

            {/* 로그아웃 버튼 */}
            <li>
              <button
                type="button"
                className="flex items-center gap-3 py-4 text-error"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                <span className="text-base">로그아웃</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
