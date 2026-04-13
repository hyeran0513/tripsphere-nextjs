"use client"

import { useState } from "react"
import { MapPin, Star, Phone, Mail } from "lucide-react"

import { getAccommodationTypeLabel } from "@/types/accommodation"
import { useAccommodationDetailQuery } from "@/hooks/queries/use-accommodation-detail-query"
import { useRoomsQuery } from "@/hooks/queries/use-rooms-query"
import { useReviewsQuery } from "@/hooks/queries/use-reviews-query"
import { AccommodationImages } from "./accommodation-images"
import { BookingSearchBox } from "./booking-search-box"
import { RoomCard } from "./room-card"
import { ReviewList } from "./review-list"
import { NoData } from "@/components/ui/no-data"

type AccommodationDetailProps = {
  accommodationId: string
}

export function AccommodationDetail({ accommodationId }: AccommodationDetailProps) {
  const { data: accommodation, isLoading } = useAccommodationDetailQuery(accommodationId)
  const { data: rooms, isLoading: roomsLoading } = useRoomsQuery(accommodationId)
  const { data: reviews } = useReviewsQuery(accommodationId)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [bookingParams, setBookingParams] = useState<{
    checkIn: string
    checkOut: string
    guests: number
  } | null>(null)

  const filteredRooms = rooms?.filter((room) => {
    if (!bookingParams) return true
    return room.capacity.adults >= bookingParams.guests && room.stock > 0 && room.availability
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <div className="skeleton h-72 w-full rounded-lg sm:h-96" />
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-5 w-1/3" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!accommodation) {
    return <NoData title="숙소를 찾을 수 없습니다." />
  }

  const avgRating =
    accommodation.total_rating && accommodation.review_count
      ? (accommodation.total_rating / accommodation.review_count).toFixed(1)
      : null

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4">
      {/* 이미지 */}
      <AccommodationImages images={accommodation.images ?? []} name={accommodation.name} />

      {/* 기본 정보 */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          {/* 타입 */}
          <div>
            <span className="badge badge-outline badge-sm mb-2">
              {getAccommodationTypeLabel(accommodation.type ?? "")}
            </span>
            <h1 className="text-2xl font-bold">{accommodation.name}</h1>
          </div>

          {/* 평점 */}
          {avgRating && (
            <div className="flex items-center gap-1 text-warning">
              <Star className="size-5 fill-current" />
              <span className="text-lg font-semibold">{avgRating}</span>
              <span className="text-sm text-base-content/50">({accommodation.review_count})</span>
            </div>
          )}
        </div>

        {/* 위치 및 설명 */}
        <p className="flex items-center gap-1 text-sm text-base-content/60">
          <MapPin className="size-4" />
          {accommodation.location?.city} {accommodation.location?.sub_city}{" "}
          {accommodation.location?.place_name}
        </p>

        {/* 설명 및 호스트 정보 */}
        {accommodation.description && (
          <p className="text-base-content/80">{accommodation.description}</p>
        )}

        {accommodation.host && (
          <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
            {/* 연락처 */}
            {accommodation.host.contact && (
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" />
                {accommodation.host.contact}
              </span>
            )}

            {/* 이메일 */}
            {accommodation.host.email && (
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {accommodation.host.email}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="divider" />

      <section>
        <h2 className="mb-4 text-xl font-bold">객실</h2>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 객실 카드 */}
          <div className="flex-1">
            {roomsLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="skeleton h-64 rounded-lg" />
                ))}
              </div>
            ) : filteredRooms && filteredRooms.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-base-content/50">
                {bookingParams ? "조건에 맞는 객실이 없습니다." : "등록된 객실이 없습니다."}
              </p>
            )}
          </div>

          {/* 검색 사이드바 */}
          <div className="w-full shrink-0 lg:w-72">
            <BookingSearchBox
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onGuestsChange={setGuests}
              onSearch={() => setBookingParams({ checkIn, checkOut, guests })}
            />
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="divider" />

      {/* 리뷰 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">
          리뷰 {reviews && reviews.length > 0 && `(${reviews.length})`}
        </h2>
        <ReviewList reviews={reviews ?? []} />
      </section>
    </div>
  )
}
