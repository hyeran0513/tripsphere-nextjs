"use client"

import Image from "next/image"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import { useQueries } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"

import { PATH } from "@/constants/path"
import { db } from "@/lib/firebase/client"
import { getAccommodationTypeLabel } from "@/types/accommodation"
import type { Accommodation } from "@/types/accommodation"
import type { Room } from "@/types/room"
import { getDiscountedPrice, getStayTypeLabel } from "@/types/room"

type AccommodationListProps = {
  accommodations: Accommodation[]
  isSearching: boolean
  hasSearched: boolean
}

async function fetchRoomsByAccommodation(accommodationId: string): Promise<Room[]> {
  const q = query(collection(db, "rooms"), where("accommodation_id", "==", accommodationId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Room, "id">),
  }))
}

export function AccommodationList({
  accommodations,
  isSearching,
  hasSearched,
}: AccommodationListProps) {
  const roomQueries = useQueries({
    queries: accommodations.map((acc) => ({
      queryKey: ["rooms", acc.id],
      queryFn: () => fetchRoomsByAccommodation(acc.id),
    })),
  })

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
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-base-content/50">
        <MapPin className="mb-3 size-12" />
        <p className="text-lg font-medium">숙소를 검색해보세요</p>
        <p className="text-sm">지역과 날짜를 선택하고 검색하세요.</p>
      </div>
    )
  }

  if (accommodations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-base-content/50">
        <MapPin className="mb-3 size-12" />
        <p className="text-lg font-medium">검색 결과가 없습니다</p>
        <p className="text-sm">다른 지역이나 날짜로 검색해보세요.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {accommodations.map((item, index) => {
        const rooms = roomQueries[index]?.data ?? []
        const minPriceRoom =
          rooms.length > 0
            ? rooms.reduce((min, r) => (getDiscountedPrice(r) < getDiscountedPrice(min) ? r : min))
            : null

        return (
          <Link
            key={item.id}
            href={`${PATH.ACCOMMODATION}/${item.id}`}
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
                    <h3 className="card-title text-base">{item.name}</h3>
                    {item.type && (
                      <span className="badge badge-outline badge-sm">
                        {getAccommodationTypeLabel(item.type)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-base-content/60">
                    <MapPin className="size-3.5" />
                    {item.location?.city} {item.location?.sub_city}
                  </p>
                </div>

                {item.total_rating && item.review_count ? (
                  <div className="flex items-center gap-1 text-sm text-warning">
                    <Star className="size-4 fill-current" />
                    <span>{(item.total_rating / item.review_count).toFixed(1)}</span>
                    <span className="text-base-content/50">({item.review_count})</span>
                  </div>
                ) : null}
              </div>

              {item.description && (
                <p className="line-clamp-2 text-sm text-base-content/70">{item.description}</p>
              )}

              {/* 객실 정보 */}
              {rooms.length > 0 && (
                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-base-200 pt-2">
                  <span className="text-xs text-base-content/50">객실 {rooms.length}개</span>
                  {minPriceRoom && (
                    <div className="flex items-center gap-2">
                      <span className="badge badge-outline badge-xs">
                        {getStayTypeLabel(minPriceRoom.stay_type)}
                      </span>
                      {minPriceRoom.discount_rate > 0 && (
                        <>
                          <span className="text-xs font-bold text-error">
                            {minPriceRoom.discount_rate}%
                          </span>
                          <span className="text-xs text-base-content/40 line-through">
                            {minPriceRoom.original_price.toLocaleString()}원
                          </span>
                        </>
                      )}
                      <span className="font-bold">
                        {getDiscountedPrice(minPriceRoom).toLocaleString()}원~
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
