"use client"

import { CalendarDays } from "lucide-react"
import DatePicker from "react-datepicker"
import { ko } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

type DateRangeFieldProps = {
  checkIn: string
  checkOut: string
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
}

export function DateRangeField({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DateRangeFieldProps) {
  const today = new Date()

  return (
    <div className="form-control min-w-0 flex-1">
      {/* 날짜 라벨 */}
      <label className="label py-0.5">
        <span className="label-text flex items-center gap-1 text-xs font-semibold">
          <CalendarDays className="size-3.5" />
          체크인 · 체크아웃
        </span>
      </label>

      {/* 날짜 선택 필드 */}
      <DatePicker
        selectsRange
        startDate={checkIn ? new Date(checkIn + "T00:00:00") : null}
        endDate={checkOut ? new Date(checkOut + "T00:00:00") : null}
        onChange={(dates) => {
          const [start, end] = dates as [Date | null, Date | null]
          onCheckInChange(start ? formatDate(start) : "")
          onCheckOutChange(end ? formatDate(end) : "")
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
  )
}
