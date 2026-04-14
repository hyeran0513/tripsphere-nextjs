"use client"

import Image from "next/image"
import { Users, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"
import { useId } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import type { Room } from "@/types/room"

type RoomListProps = {
  rooms: Room[]
  isLoading: boolean
  onBook: (roomId: string) => void
}

export function RoomList({ rooms, isLoading, onBook }: RoomListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-40 w-full rounded-lg" />
        <div className="skeleton h-40 w-full rounded-lg" />
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-base-300 p-8 text-center text-sm text-base-content/60">
        등록된 객실이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        const isSoldOut = room.stock === 0
        const hasDiscount = !!room.discount_rate && room.discount_rate > 0

        return (
          <article
            key={room.id}
            className="card card-side border border-base-300 bg-base-100 overflow-hidden"
          >
            <RoomImageSwiper images={room.images ?? []} name={room.name} />

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {room.type && (
                    <span className="badge badge-outline badge-sm mb-1">{room.type}</span>
                  )}
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                </div>

                {hasDiscount && (
                  <span className="badge badge-primary">{room.discount_rate}% OFF</span>
                )}
              </div>

              {room.description && (
                <p className="line-clamp-2 text-sm text-base-content/70">{room.description}</p>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-base-content/60">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  기준 {room.capacity.adults}인 / 최대 {room.max_capacity}인
                </span>
                {room.size?.pyeong && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="size-3.5" />
                    {room.size.pyeong}평{room.size.m2 ? ` (${room.size.m2}m²)` : ""}
                  </span>
                )}
              </div>

              {room.services && room.services.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.services.slice(0, 5).map((svc) => (
                    <span key={svc} className="badge badge-ghost badge-sm">
                      {svc}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                <div>
                  {hasDiscount && room.original_price && (
                    <div className="text-xs text-base-content/40 line-through">
                      {room.original_price.toLocaleString()}원
                    </div>
                  )}
                  <div className="text-xl font-bold">
                    {room.price_point.toLocaleString()}
                    <span className="ml-0.5 text-sm font-medium">원</span>
                  </div>
                  <div className={`text-xs ${isSoldOut ? "text-error" : "text-primary"}`}>
                    {isSoldOut ? "매진" : `남은 객실 ${room.stock}개`}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={isSoldOut}
                  onClick={() => onBook(room.id)}
                >
                  예약하기
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

type RoomImageSwiperProps = {
  images: string[]
  name: string
}

function RoomImageSwiper({ images, name }: RoomImageSwiperProps) {
  const uid = useId().replace(/:/g, "")

  if (images.length === 0) {
    return (
      <figure className="relative hidden aspect-[4/3] w-56 shrink-0 sm:block">
        <div className="flex h-full w-full items-center justify-center bg-base-200 text-xs text-base-content/30">
          이미지 없음
        </div>
      </figure>
    )
  }

  return (
    <figure className="group relative hidden aspect-[4/3] w-56 shrink-0 sm:block">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={images.length > 1}
        navigation={{
          prevEl: `.room-swiper-prev-${uid}`,
          nextEl: `.room-swiper-next-${uid}`,
        }}
        pagination={{ clickable: true }}
        className="h-full w-full [--swiper-pagination-bullet-inactive-color:#ffffff] [--swiper-pagination-color:#ffffff]"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={`${src}-${idx}`}>
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`${name} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="14rem"
                unoptimized
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            className={`room-swiper-prev-${uid} absolute left-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-base-100/80 opacity-0 shadow transition-opacity group-hover:opacity-100`}
            onClick={(e) => e.preventDefault()}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            className={`room-swiper-next-${uid} absolute right-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-base-100/80 opacity-0 shadow transition-opacity group-hover:opacity-100`}
            onClick={(e) => e.preventDefault()}
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </figure>
  )
}
