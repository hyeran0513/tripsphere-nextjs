"use client"

import Image from "next/image"
import { MapPin, Star, Users } from "lucide-react"
import Link from "next/link"

import { PATH } from "@/constants/path"
import { getLodgingTypeLabel } from "@/types/lodging"
import type { Lodging } from "@/types/lodging"
import { NoData } from "@/components/ui/no-data"

type LodgingListProps = {
  lodgings: Lodging[]
  isSearching: boolean
  hasSearched: boolean
}

export function LodgingList({ lodgings, isSearching, hasSearched }: LodgingListProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-40 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <NoData
        icon={<MapPin className="mb-3 size-12" />}
        title="숙소를 검색해보세요"
        description="지역과 날짜를 선택하고 검색하세요."
        className="flex-1 py-16"
      />
    )
  }

  if (lodgings.length === 0) {
    return (
      <NoData
        icon={<MapPin className="mb-3 size-12" />}
        title="검색 결과가 없습니다"
        description="다른 지역이나 날짜로 검색해보세요."
        className="flex-1 py-16"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {lodgings.map((item) => (
        <Link
          key={item.id}
          href={`${PATH.LODGING}/${item.id}`}
          className="card card-side border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
        >
          <figure className="relative min-h-36 w-48 shrink-0 sm:min-h-40 sm:w-64">
            {item.images?.[0] ? (
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 12rem, 16rem"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
                이미지 없음
              </div>
            )}
          </figure>

          <div className="card-body gap-2 p-4 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  {/* 숙소 이름 */}
                  <h3 className="card-title text-base">{item.name}</h3>

                  {/* 숙소 유형 배지 */}
                  {item.type && (
                    <span className="badge badge-outline badge-sm">
                      {getLodgingTypeLabel(item.type)}
                    </span>
                  )}
                </div>

                {/* 위치 정보 */}
                <p className="mt-1 flex items-center gap-1 text-sm text-base-content/60">
                  <MapPin className="size-3.5" />
                  {item.location?.city} {item.location?.sub_city}
                </p>
              </div>

              {/* 평점 정보 */}
              {item.total_rating && item.review_count ? (
                <div className="flex items-center gap-1 text-sm text-warning">
                  <Star className="size-4 fill-current" />
                  <span>{(item.total_rating / item.review_count).toFixed(1)}</span>
                  <span className="text-base-content/50">({item.review_count})</span>
                </div>
              ) : null}
            </div>

            {/* 숙소 설명 */}
            {item.description && (
              <p className="line-clamp-2 text-sm text-base-content/70">{item.description}</p>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-base-200 pt-2">
              <span className="flex items-center gap-1 text-xs text-base-content/60">
                <Users className="size-3.5" />
                성인 {item.capacity.adults} / 아동 {item.capacity.children}
              </span>

              <span className="font-bold">{item.price_point.toLocaleString()}원</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
