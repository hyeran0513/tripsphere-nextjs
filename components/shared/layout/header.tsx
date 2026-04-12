"use client"

import { signOut } from "firebase/auth"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { auth } from "@/lib/firebase/client"

export function Header() {
  const { user, isLoading } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4">
      <div className="flex-1">
        <Link href={PATH.HOME} className="text-xl font-bold">
          TripSphere
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
            <span className="text-sm text-base-content/70">{user.displayName || user.email}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <Link href={PATH.LOGIN} className="btn btn-primary btn-sm">
            로그인
          </Link>
        )}
      </div>
    </header>
  )
}
