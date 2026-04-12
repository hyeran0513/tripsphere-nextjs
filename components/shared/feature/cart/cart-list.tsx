"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { PATH } from "@/constants/path"
import { getStayTypeLabel } from "@/types/room"
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
          <div key={i} className="skeleton h-32 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
        <ShoppingCart className="mb-3 size-12" />
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
        <ShoppingCart className="mb-3 size-12" />
        <p className="text-lg font-medium">장바구니가 비어있습니다</p>
        <p className="text-sm">마음에 드는 숙소를 찾아보세요.</p>
      </div>
    )
  }

  const handleCheckout = (roomId: string, stayType: string) => {
    const params = new URLSearchParams({ roomId, type: stayType })
    router.push(`${PATH.CHECKOUT}?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">장바구니 ({cartItems.length})</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => {
          const hasDiscount = (item.room?.discount_rate ?? 0) > 0
          const discountedPrice = item.room
            ? Math.round(item.room.original_price * (1 - item.room.discount_rate / 100))
            : 0

          return (
            <div key={item.id} className="card card-side border border-base-300 bg-base-100">
              <figure className="w-32 shrink-0 sm:w-40">
                {item.room?.image ? (
                  <img
                    src={item.room.image}
                    alt={item.room?.name ?? "객실"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-base-200 text-xs text-base-content/30">
                    이미지 없음
                  </div>
                )}
              </figure>

              <div className="card-body gap-2 p-4">
                {item.room?.accommodation_name && (
                  <p className="text-xs text-base-content/50">{item.room.accommodation_name}</p>
                )}
                <h3 className="card-title text-base">{item.room?.name ?? "객실 정보 없음"}</h3>

                {item.room && (
                  <>
                    <span className="badge badge-outline badge-sm">
                      {getStayTypeLabel(item.room.stay_type)}
                    </span>
                    <div className="flex items-center gap-2">
                      {hasDiscount && (
                        <>
                          <span className="badge badge-error badge-sm font-bold">
                            {item.room.discount_rate}%
                          </span>
                          <span className="text-sm text-base-content/40 line-through">
                            {item.room.original_price.toLocaleString()}원
                          </span>
                        </>
                      )}
                      <span className="font-bold">{discountedPrice.toLocaleString()}원</span>
                    </div>
                  </>
                )}

                <div className="card-actions mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-xs"
                    onClick={() => handleCheckout(item.room_id, item.room?.stay_type ?? "")}
                  >
                    예약하기
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-error"
                    disabled={removeFromCart.isPending}
                    onClick={() => removeFromCart.mutate(item.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
