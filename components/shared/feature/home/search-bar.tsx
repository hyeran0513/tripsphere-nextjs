"use client"

import { MapPin, Search, Users } from "lucide-react"

import { DatePickerField } from "@/components/shared/form/date-picker-field"
import { useCitiesQuery } from "@/hooks/queries/use-cities-query"

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
}: SearchBarProps) {
  const { data: cities = [], isLoading: isCitiesLoading } = useCitiesQuery()

  const today = new Date()
  const checkInDate = checkIn ? new Date(checkIn + "T00:00:00") : undefined

  const selectedCity = cities.find((c) => c.name === city)
  const subCities = selectedCity?.subCities ?? []

  return (
    <div className="flex w-full max-w-5xl items-end gap-2 rounded-2xl bg-base-100/90 p-3 shadow-lg backdrop-blur-sm">
      {/* 지역 */}
      <div className="form-control min-w-0 flex-1">
        <label className="label py-0.5">
          <span className="label-text flex items-center gap-1 text-xs font-semibold">
            <MapPin className="size-3.5" />
            지역
          </span>
        </label>

        <select
          className="select select-bordered select-sm w-full"
          value={city}
          onChange={(e) => {
            onCityChange(e.target.value)
            onSubCityChange("")
          }}
          disabled={isCitiesLoading}
        >
          <option value="">지역 선택</option>
          {cities.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 세부 지역 */}
      <div className="form-control min-w-0 flex-1">
        <label className="label py-0.5">
          <span className="label-text flex items-center gap-1 text-xs font-semibold">
            <MapPin className="size-3.5" />
            세부 지역
          </span>
        </label>

        <select
          className="select select-bordered select-sm w-full"
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

      {/* 체크인 */}
      <DatePickerField label="체크인" value={checkIn} onChange={onCheckInChange} minDate={today} />

      {/* 체크아웃 */}
      <DatePickerField
        label="체크아웃"
        value={checkOut}
        onChange={onCheckOutChange}
        minDate={checkInDate ?? today}
      />

      {/* 인원수 */}
      <div className="form-control w-20 shrink-0">
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
          onChange={(e) => onGuestsChange(Number(e.target.value))}
        />
      </div>

      {/* 검색 버튼 */}
      <button
        type="button"
        className={`btn btn-primary btn-sm shrink-0 ${isSearching ? "loading" : ""}`}
        onClick={onSearch}
        disabled={!city || !checkIn || !checkOut || isSearching}
      >
        <Search className="size-4" />
        {isSearching ? "검색 중..." : "검색"}
      </button>
    </div>
  )
}
