"use client"

import { MapPin, Star } from "lucide-react"
import Link from "next/link"

import { PATH } from "@/constants/path"
import type { Accommodation } from "@/types/accommodation"

type AccommodationListProps = {
  accommodations: Accommodation[]
  isSearching: boolean
  hasSearched: boolean
}

export function AccommodationList({
  accommodations,
  isSearching,
  hasSearched,
}: AccommodationListProps) {
  if (isSearching) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card border border-base-300 bg-base-100">
            <figure className="skeleton h-48 w-full rounded-b-none" />
            <div className="card-body gap-3 p-4">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!hasSearched) return null

  if (accommodations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-base-content/50">
        <MapPin className="mb-3 size-12" />
        <p className="text-lg font-medium">검색 결과가 없습니다</p>
        <p className="text-sm">다른 지역이나 날짜로 검색해보세요.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accommodations.map((item) => (
        <Link
          key={item.id}
          href={`${PATH.ACCOMMODATION}/${item.id}`}
          className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
        >
          <figure className="h-48 overflow-hidden">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
                이미지 없음
              </div>
            )}
          </figure>

          <div className="card-body gap-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="card-title text-base">{item.name}</h3>
              {item.total_rating && item.review_count ? (
                <div className="flex items-center gap-1 text-sm text-warning">
                  <Star className="size-4 fill-current" />
                  <span>{(item.total_rating / item.review_count).toFixed(1)}</span>
                  <span className="text-base-content/50">({item.review_count})</span>
                </div>
              ) : null}
            </div>

            <p className="flex items-center gap-1 text-sm text-base-content/60">
              <MapPin className="size-3.5" />
              {item.location?.city} {item.location?.sub_city}
            </p>

            {item.description && (
              <p className="line-clamp-2 text-sm text-base-content/70">{item.description}</p>
            )}

            <div className="mt-1">
              <span className="badge badge-outline badge-sm">{item.type}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
