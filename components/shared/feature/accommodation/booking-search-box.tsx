"use client"

import { Search } from "lucide-react"

import { DateRangeField } from "@/components/shared/form/date-range-field"
import { GuestCounterField } from "@/components/shared/form/guest-counter-field"

type BookingSearchBoxProps = {
  checkIn: string
  checkOut: string
  guests: number
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  onGuestsChange: (value: number) => void
  onSearch: () => void
}

export function BookingSearchBox({
  checkIn,
  checkOut,
  guests,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSearch,
}: BookingSearchBoxProps) {
  return (
    <div className="card sticky top-20 border border-base-300 bg-base-100">
      <div className="card-body gap-4 p-4">
        <h3 className="flex items-center gap-2 font-bold">예약 조건</h3>

        {/* 날짜 선택 필드 */}
        <DateRangeField
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={onCheckInChange}
          onCheckOutChange={onCheckOutChange}
        />

        {/* 게스트 수 선택 필드 */}
        <GuestCounterField value={guests} onChange={onGuestsChange} className="w-full" />

        {/* 검색 버튼 */}
        <button
          type="button"
          className="btn btn-primary btn-sm w-full"
          onClick={onSearch}
          disabled={!checkIn || !checkOut}
        >
          <Search className="size-4" />
          객실 검색
        </button>
      </div>
    </div>
  )
}
