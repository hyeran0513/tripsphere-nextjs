"use client"

import Image from "next/image"
import { Heart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { PATH } from "@/constants/path"
import { getLodgingTypeLabel } from "@/types/lodging"
import { useAuth } from "@/hooks/auth/use-auth"
import { useCartQuery } from "@/hooks/queries/use-cart-query"
import { useRemoveFromCartMutation } from "@/hooks/mutations/use-cart-mutation"

export function CartList() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: cartItems, isLoading } = useCartQuery(user?.uid ?? null)
  const removeFromCart = useRemoveFromCartMutation(user?.uid ?? "")

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-36 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
        <Heart className="mb-3 size-12" />
        <p className="text-lg font-medium">로그인이 필요합니다</p>
        <button
          type="button"
          className="btn btn-primary btn-sm mt-4"
          onClick={() => router.push(PATH.LOGIN)}
        >
          로그인하기
        </button>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
        <Heart className="mb-3 size-12" />
        <p className="text-lg font-medium">찜 목록이 비어있습니다</p>
        <p className="text-sm">마음에 드는 숙소를 찾아보세요.</p>
      </div>
    )
  }

  const handleViewLodging = (lodgingId: string) => {
    router.push(`${PATH.LODGING}/${lodgingId}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">찜 목록 ({cartItems.length})</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="card card-side border border-base-300 bg-base-100">
            {/* 이미지 */}
            <figure className="relative min-h-32 w-40 shrink-0 sm:min-h-36 sm:w-52">
              {item.lodging?.image ? (
                <Image
                  src={item.lodging.image}
                  alt={item.lodging?.name ?? "숙소"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 10rem, 13rem"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-base-200 text-xs text-base-content/30">
                  이미지 없음
                </div>
              )}
            </figure>

            {/* 정보 */}
            <div className="card-body flex-1 gap-2 p-4">
              <h3 className="card-title text-base">{item.lodging?.name ?? "숙소 정보 없음"}</h3>

              {item.lodging?.type && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="badge badge-outline text-xs">
                    {getLodgingTypeLabel(item.lodging.type)}
                  </span>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex flex-col justify-center gap-2 border-l border-base-300 p-4">
              {/* 객실 보기 버튼 */}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleViewLodging(item.lodging_id)}
              >
                객실 보기
              </button>

              {/* 찜 제거 버튼 */}
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                disabled={removeFromCart.isPending}
                onClick={() => removeFromCart.mutate(item.id)}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
