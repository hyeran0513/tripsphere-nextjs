"use client"

import { useState } from "react"
import { CalendarDays, Users, Search } from "lucide-react"
import DatePicker from "react-datepicker"
import { ko } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"

type BookingSearchBoxProps = {
  onSearch: (params: { checkIn: string; checkOut: string; guests: number }) => void
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function BookingSearchBox({ onSearch }: BookingSearchBoxProps) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  const today = new Date()

  const handleSearch = () => {
    onSearch({ checkIn, checkOut, guests })
  }

  return (
    <div className="card sticky top-20 border border-base-300 bg-base-100">
      <div className="card-body gap-4 p-4">
        <h3 className="flex items-center gap-2 font-bold">예약 조건</h3>

        {/* 체크인 · 체크아웃 */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text flex items-center gap-1 text-xs font-semibold">
              <CalendarDays className="size-3.5" />
              체크인 · 체크아웃
            </span>
          </label>
          <DatePicker
            selectsRange
            startDate={checkIn ? new Date(checkIn + "T00:00:00") : null}
            endDate={checkOut ? new Date(checkOut + "T00:00:00") : null}
            onChange={(dates) => {
              const [start, end] = dates as [Date | null, Date | null]
              setCheckIn(start ? formatDate(start) : "")
              setCheckOut(end ? formatDate(end) : "")
            }}
            minDate={today}
            locale={ko}
            dateFormat="yyyy.MM.dd"
            placeholderText="날짜 선택"
            className="input input-bordered input-sm w-full"
            wrapperClassName="w-full"
            monthsShown={2}
          />
        </div>

        {/* 인원 */}
        <div className="form-control">
          <label className="label py-0.5">
            <span className="label-text flex items-center gap-1 text-xs font-semibold">
              <Users className="size-3.5" />
              인원
            </span>
          </label>
          <div className="join w-full">
            <button
              type="button"
              className="btn btn-outline btn-sm join-item"
              disabled={guests <= 1}
              onClick={() => setGuests(guests - 1)}
            >
              -
            </button>
            <input
              type="number"
              className="join-item w-full border border-base-300 text-center text-sm outline-none"
              value={guests || ""}
              min={1}
              max={20}
              onChange={(e) => setGuests(e.target.value === "" ? 0 : Number(e.target.value))}
              onBlur={(e) => {
                const v = Number(e.target.value)
                if (!v || v < 1) setGuests(1)
                else if (v > 20) setGuests(20)
              }}
            />
            <button
              type="button"
              className="btn btn-outline btn-sm join-item"
              disabled={guests >= 20}
              onClick={() => setGuests(guests + 1)}
            >
              +
            </button>
          </div>
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
      </div>
    </div>
  )
}
