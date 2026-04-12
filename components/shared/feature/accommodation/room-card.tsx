"use client"

import { ShoppingCart, Clock, Moon } from "lucide-react"
import { useRouter } from "next/navigation"

import { PATH } from "@/constants/path"
import { useAuth } from "@/hooks/auth/use-auth"
import { useAddToCartMutation } from "@/hooks/mutations/use-cart-mutation"
import type { Room } from "@/types/room"

type RoomCardProps = {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const addToCart = useAddToCartMutation()

  const handleAddToCart = () => {
    if (!user) {
      router.push(PATH.LOGIN)
      return
    }
    addToCart.mutate({ room_id: room.id, user_id: user.uid })
  }

  const handleBook = (type: "hourly" | "nightly") => {
    if (!user) {
      router.push(PATH.LOGIN)
      return
    }
    const params = new URLSearchParams({
      roomId: room.id,
      type,
    })
    router.push(`${PATH.CHECKOUT}?${params.toString()}`)
  }

  return (
    <div className="card border border-base-300 bg-base-100">
      <figure className="h-48 overflow-hidden">
        {room.images?.[0] ? (
          <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
            이미지 없음
          </div>
        )}
      </figure>

      <div className="card-body gap-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="card-title text-base">{room.name}</h3>
            {room.description && (
              <p className="mt-1 text-sm text-base-content/60">{room.description}</p>
            )}
          </div>
          <span className="badge badge-outline text-xs">
            성인 {room.capacity.adults}인 / 아동 {room.capacity.children}인
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <span
            className={`badge badge-sm ${room.remaining_rooms > 0 ? "badge-success" : "badge-error"}`}
          >
            남은 객실 {room.remaining_rooms}개
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          {room.price_per_hour != null && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-base-content/70">
                <Clock className="size-3.5" />
                대실
              </span>
              <span className="font-semibold">{room.price_per_hour.toLocaleString()}원</span>
            </div>
          )}
          {room.price_per_night != null && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-base-content/70">
                <Moon className="size-3.5" />
                숙박
              </span>
              <span className="font-semibold">{room.price_per_night.toLocaleString()}원</span>
            </div>
          )}
        </div>

        <div className="card-actions mt-2 flex gap-2">
          {room.price_per_hour != null && (
            <button
              type="button"
              className="btn btn-outline btn-sm flex-1"
              disabled={room.remaining_rooms === 0}
              onClick={() => handleBook("hourly")}
            >
              <Clock className="size-3.5" />
              대실 예약
            </button>
          )}
          {room.price_per_night != null && (
            <button
              type="button"
              className="btn btn-primary btn-sm flex-1"
              disabled={room.remaining_rooms === 0}
              onClick={() => handleBook("nightly")}
            >
              <Moon className="size-3.5" />
              숙박 예약
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={room.remaining_rooms === 0 || addToCart.isPending}
            onClick={handleAddToCart}
            title="장바구니에 담기"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
