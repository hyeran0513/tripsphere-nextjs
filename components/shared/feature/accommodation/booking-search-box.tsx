"use client"

import { useState } from "react"
import { CalendarDays, Users, Search } from "lucide-react"

import { DatePickerField } from "@/components/shared/form/date-picker-field"

type BookingSearchBoxProps = {
  onSearch: (params: { checkIn: string; checkOut: string; guests: number }) => void
}

export function BookingSearchBox({ onSearch }: BookingSearchBoxProps) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  const today = new Date()
  const checkInDate = checkIn ? new Date(checkIn + "T00:00:00") : undefined

  const handleSearch = () => {
    onSearch({ checkIn, checkOut, guests })
  }

  return (
    <div className="card border border-base-300 bg-base-100 sticky top-4">
      <div className="card-body gap-4 p-4">
        <h3 className="flex items-center gap-2 font-bold">예약 조건</h3>

        {/* 체크인 */}
        <DatePickerField label="체크인" value={checkIn} onChange={setCheckIn} minDate={today} />

        {/* 체크아웃 */}
        <DatePickerField
          label="체크아웃"
          value={checkOut}
          onChange={setCheckOut}
          minDate={checkInDate ?? today}
        />

        {/* 인원 */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text flex items-center gap-1 text-xs font-semibold">
              <Users className="size-3.5" />
              인원
            </span>
          </label>
          <input
            type="number"
            className="input input-bordered input-sm w-full"
            value={guests}
            min={1}
            max={20}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>

        {/* 검색 버튼 */}
        <button
          type="button"
          className="btn btn-primary btn-sm w-full"
          onClick={handleSearch}
          disabled={!checkIn || !checkOut}
        >
          <Search className="size-4" />
          객실 검색
        </button>

        {/* 선택된 조건 표시 */}
        {checkIn && checkOut && (
          <div className="rounded-lg bg-base-200 p-3 text-xs text-base-content/70">
            <p className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              {checkIn} ~ {checkOut}
            </p>
            <p className="mt-1 flex items-center gap-1">
              <Users className="size-3" />
              {guests}명
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
