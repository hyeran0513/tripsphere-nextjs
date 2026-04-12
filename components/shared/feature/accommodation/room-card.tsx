"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from "@/hooks/mutations/use-cart-mutation"
import { useCartQuery } from "@/hooks/queries/use-cart-query"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/shared/ui/toast"
import type { Room } from "@/types/room"
import {
  getDiscountedPrice,
  formatDiscountRate,
  formatRoomTime,
  getStayTypeLabel,
  getRoomTypeLabel,
} from "@/types/room"

type RoomCardProps = {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const addToCart = useAddToCartMutation()
  const removeFromCart = useRemoveFromCartMutation(user?.uid ?? "")
  const { data: cartItems } = useCartQuery(user?.uid ?? null)
  const { toasts, show } = useToast()

  const discountedPrice = getDiscountedPrice(room)
  const hasDiscount = room.discount_rate > 0
  const isSoldOut = room.stock === 0 || !room.availability

  // 장바구니에 이미 담겨있는지 확인
  const cartItem = cartItems?.find((item) => item.room_id === room.id)
  const isInCart = !!cartItem

  const handleToggleWish = () => {
    if (!user) {
      router.push(PATH.LOGIN)
      return
    }

    if (isInCart) {
      removeFromCart.mutate(cartItem.id)
      show("찜 목록에서 해제되었습니다")
    } else {
      addToCart.mutate({ room_id: room.id, user_id: user.uid })
      show("찜 목록에 추가되었습니다")
    }
  }

  const handleBook = () => {
    if (!user) {
      router.push(PATH.LOGIN)
      return
    }
    const params = new URLSearchParams({
      roomId: room.id,
      type: room.stay_type,
    })
    router.push(`${PATH.CHECKOUT}?${params.toString()}`)
  }

  return (
    <>
      <div className="card card-side border border-base-300 bg-base-100">
        {/* 이미지 (왼쪽) */}
        <figure className="relative min-h-32 w-40 shrink-0 sm:min-h-36 sm:w-52">
          {room.images?.[0] ? (
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 10rem, 13rem"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
              이미지 없음
            </div>
          )}
        </figure>

        {/* 정보 (중앙) */}
        <div className="card-body flex-1 gap-2 p-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="card-title text-base">{room.name}</h3>
              {room.type && (
                <span className="badge badge-outline badge-sm">{getRoomTypeLabel(room.type)}</span>
              )}
            </div>
            {room.description && (
              <p className="mt-1 text-sm text-base-content/60">{room.description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="badge badge-outline text-xs">
              성인 {room.capacity.adults}인 / 아동 {room.capacity.children}인
            </span>
            <span className="badge badge-outline text-xs">{getStayTypeLabel(room.stay_type)}</span>
            <span className={`text-xs font-medium ${isSoldOut ? "text-error" : "text-primary"}`}>
              {isSoldOut ? "매진" : `남은 객실 ${room.stock}개`}
            </span>
          </div>

          <div className="text-xs text-base-content/50">
            체크인 {formatRoomTime(room.check_in)} · 체크아웃 {formatRoomTime(room.check_out)}
          </div>

          {/* 가격 */}
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <>
                <span className="text-sm font-bold text-error">
                  {formatDiscountRate(room.discount_rate)}
                </span>
                <span className="text-sm text-base-content/40 line-through">
                  {room.original_price.toLocaleString()}원
                </span>
              </>
            )}
            <span className="text-lg font-bold">{discountedPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 버튼 (오른쪽) */}
        <div className="flex flex-col justify-center gap-2 border-l border-base-300 p-4">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={isSoldOut}
            onClick={handleBook}
          >
            예약하기
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={addToCart.isPending || removeFromCart.isPending}
            onClick={handleToggleWish}
            title={isInCart ? "찜 해제" : "찜하기"}
          >
            <Heart
              className={`size-5 ${isInCart ? "fill-red-500 text-red-500" : "text-base-content/40"}`}
            />
          </button>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  )
}
