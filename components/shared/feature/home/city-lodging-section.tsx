"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

import { PATH } from "@/constants/path"
import { getLodgingTypeLabel } from "@/types/lodging"
import { useCityLodgingsQuery } from "@/hooks/queries/use-city-lodgings-query"
import { useId } from "react"

type CityLodgingSectionProps = {
  city: string
  label: string
}

export function CityLodgingSection({ city, label }: CityLodgingSectionProps) {
  const { data: lodgings, isLoading } = useCityLodgingsQuery(city)
  const id = useId().replace(/:/g, "")

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-bold">{label}</h2>
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-56 w-full rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (!lodgings || lodgings.length === 0) return null

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        {/* 섹션 제목 */}
        <h2 className="text-xl font-bold">{label}</h2>

        <div className="flex gap-1">
          {/* 이전 버튼 */}
          <button type="button" className={`swiper-prev-${id} btn btn-circle btn-ghost btn-sm`}>
            <ChevronLeft className="size-4" />
          </button>

          {/* 다음 버튼 */}
          <button type="button" className={`swiper-next-${id} btn btn-circle btn-ghost btn-sm`}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={6}
        navigation={{
          prevEl: `.swiper-prev-${id}`,
          nextEl: `.swiper-next-${id}`,
        }}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
      >
        {lodgings.map((item) => {
          const avgRating =
            item.total_rating && item.review_count
              ? (item.total_rating / item.review_count).toFixed(1)
              : null

          return (
            <SwiperSlide key={item.id}>
              <Link href={`${PATH.LODGING}/${item.id}`} className="group block">
                <figure className="relative aspect-square overflow-hidden rounded-lg">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="200px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                </figure>

                <div className="py-3">
                  {/* 숙소 이름 */}
                  <h3 className="truncate text-sm font-semibold">{item.name}</h3>

                  <div className="mt-1 flex items-center justify-between">
                    {/* 숙소 유형 */}
                    {item.type && (
                      <span className="text-xs text-base-content/50">
                        {getLodgingTypeLabel(item.type)}
                      </span>
                    )}

                    {/* 평점 */}
                    {avgRating && (
                      <span className="flex items-center gap-0.5 text-xs text-warning">
                        <Star className="size-3 fill-current" />
                        {avgRating}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
