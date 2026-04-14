"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useId } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

type RoomImageSwiperProps = {
  images: string[]
  name: string
}

export function RoomImageSwiper({ images, name }: RoomImageSwiperProps) {
  const uid = useId().replace(/:/g, "")

  // 이미지가 없을 때 표시
  if (images.length === 0) {
    return (
      <figure className="relative hidden aspect-4/3 w-56 shrink-0 sm:block">
        <div className="flex h-full w-full items-center justify-center bg-base-200 text-xs text-base-content/30">
          이미지 없음
        </div>
      </figure>
    )
  }

  return (
    <figure className="group relative hidden aspect-4/3 w-56 shrink-0 sm:block">
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
          {/* 이전 이미지 버튼 */}
          <button
            type="button"
            aria-label="이전 이미지"
            className={`room-swiper-prev-${uid} absolute left-2 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-base-100/80 opacity-0 shadow transition-opacity group-hover:opacity-100`}
            onClick={(e) => e.preventDefault()}
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* 다음 이미지 버튼 */}
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
