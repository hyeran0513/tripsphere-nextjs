"use client"

import { Search } from "lucide-react"

import { RegionSelect } from "@/components/shared/form/region-select"
import { DateRangeField } from "@/components/shared/form/date-range-field"
import { GuestCounterField } from "@/components/shared/form/guest-counter-field"

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
  return (
    <div
      className={`${vertical ? "flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg" : "flex w-full max-w-6xl items-end gap-2 rounded-2xl bg-white p-3 shadow-lg"}`}
    >
      {/* 지역 선택 필드 */}
      <RegionSelect
        city={city}
        subCity={subCity}
        onCityChange={onCityChange}
        onSubCityChange={onSubCityChange}
      />

      {/* 날짜 선택 필드 */}
      <DateRangeField
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
      />

      {/* 게스트 수 선택 필드 */}
      <GuestCounterField
        value={guests}
        onChange={onGuestsChange}
        className={vertical ? "w-full" : undefined}
      />

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
