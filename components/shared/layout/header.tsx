"use client"

import { signOut } from "firebase/auth"
import { Heart, LogOut, User } from "lucide-react"
import Link from "next/link"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { auth } from "@/lib/firebase/client"

export function Header() {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="flex-1">
          <Link href={PATH.HOME} className="flex items-center text-xl font-bold">
            <p className="text-primary">TRIP</p>SPHERE
          </Link>
        </div>

        <div className="flex-none">
          {isLoading ? (
            <div className="skeleton h-8 w-24" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href={PATH.CART} className="btn btn-ghost btn-sm" title="찜">
                <Heart className="size-5" />
              </Link>
              <Link href={PATH.MYPAGE} className="btn btn-ghost btn-sm" title="마이페이지">
                <User className="size-5" />
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => signOut(auth)}>
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={PATH.LOGIN} className="btn btn-ghost btn-sm">
                로그인
              </Link>
              <Link href={PATH.SIGNUP} className="btn btn-ghost btn-sm">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
