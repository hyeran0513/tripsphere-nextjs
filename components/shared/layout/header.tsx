"use client"

import { ShoppingCart, User } from "lucide-react"
import Link from "next/link"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"

export function Header() {
  const { user, isLoading } = useAuth()

  return (
    <header className="border-b border-base-300 bg-base-100">
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
              <Link href={PATH.CART} className="btn btn-ghost btn-sm" title="장바구니">
                <ShoppingCart className="size-5" />
              </Link>
              <Link href={PATH.MYPAGE} className="btn btn-ghost btn-sm gap-1">
                <User className="size-4" />
                <span className="text-sm">{user.displayName || user.email}</span>
              </Link>
            </div>
          ) : (
            <Link href={PATH.LOGIN} className="btn btn-primary btn-sm">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
