"use client"

import { CalendarDays, MapPin, Search, Users } from "lucide-react"
import DatePicker from "react-datepicker"
import { ko } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"

import { useCitiesQuery } from "@/hooks/queries/use-cities-query"

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

type SearchBarProps = {
  city: string
  onCityChange: (value: string) => void
  subCity: string
  onSubCityChange: (value: string) => void
  checkIn: string
  onCheckInChange: (value: string) => void
  checkOut: string
  onCheckOutChange: (value: string) => void
  guests: number
  onGuestsChange: (value: number) => void
  onSearch: () => void
  isSearching?: boolean
  vertical?: boolean
}

export function SearchBar({
  city,
  onCityChange,
  subCity,
  onSubCityChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onSearch,
  isSearching,
  vertical,
}: SearchBarProps) {
  const { data: cities = [], isLoading: isCitiesLoading } = useCitiesQuery()

  const today = new Date()

  const selectedCity = cities.find((c) => c.name === city)
  const subCities = selectedCity?.subCities ?? []

  return (
    <div
      className={`${vertical ? "flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg" : "flex w-full max-w-6xl items-end gap-2 rounded-2xl bg-white p-3 shadow-lg"}`}
    >
      {/* 지역 */}
      <div className="form-control min-w-0 flex-1">
        <label className="label py-0.5">
          <span className="label-text flex items-center gap-1 text-xs font-semibold">
            <MapPin className="size-3.5" />
            지역
          </span>
        </label>

        <div className="flex gap-2">
          <select
            className="select select-bordered select-sm flex-1"
            value={city}
            onChange={(e) => {
              onCityChange(e.target.value)
              onSubCityChange("")
            }}
            disabled={isCitiesLoading}
          >
            <option value="">선택</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered select-sm flex-1"
            value={subCity}
            onChange={(e) => onSubCityChange(e.target.value)}
            disabled={!city || subCities.length === 0}
          >
            <option value="">전체</option>
            {subCities.map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 체크인 · 체크아웃 */}
      <div className="form-control min-w-0 flex-1">
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

      {/* 인원수 */}
      <div className={`form-control ${vertical ? "w-full" : "min-w-0 flex-1"}`}>
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
            onClick={() => onGuestsChange(guests - 1)}
          >
            -
          </button>
          <input
            type="number"
            className="join-item w-full border border-base-300 text-center text-sm outline-none"
            value={guests || ""}
            min={1}
            max={20}
            onChange={(e) => onGuestsChange(e.target.value === "" ? 0 : Number(e.target.value))}
            onBlur={(e) => {
              const v = Number(e.target.value)
              if (!v || v < 1) onGuestsChange(1)
              else if (v > 20) onGuestsChange(20)
            }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm join-item"
            disabled={guests >= 20}
            onClick={() => onGuestsChange(guests + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        type="button"
        className={`btn btn-primary btn-sm ${vertical ? "w-full" : "shrink-0"} ${isSearching ? "loading" : ""}`}
        onClick={onSearch}
        disabled={isSearching}
      >
        <Search className="size-4" />
        {isSearching ? "검색 중..." : "검색"}
      </button>
    </div>
  )
}
