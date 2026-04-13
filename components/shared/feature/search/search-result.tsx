"use client"

import { Building, Building2, DoorOpen, Gem, Hotel, LayoutGrid, MoreHorizontal } from "lucide-react"

import { LodgingList } from "@/components/shared/feature/home/lodging-list"
import { SearchBar } from "@/components/shared/feature/home/search-bar"
import {
  LODGING_CATEGORIES,
  type LodgingCategory,
  useSearchPage,
} from "@/hooks/search/use-search-page"

const CATEGORY_ICONS: Record<LodgingCategory, React.ReactNode> = {
  전체: <LayoutGrid className="size-4" />,
  관광호텔: <Hotel className="size-4" />,
  일반호텔: <Building2 className="size-4" />,
  여관업: <DoorOpen className="size-4" />,
  "숙박업(생활)": <Building className="size-4" />,
  휴양콘도미니엄업: <Gem className="size-4" />,
  "숙박업 기타": <MoreHorizontal className="size-4" />,
}

export function SearchResult() {
  const {
    city,
    setCity,
    subCity,
    setSubCity,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    handleSearch,
    category,
    setCategory,
    lodgings,
    isSearching,
    hasSearched,
  } = useSearchPage()

  return (
    <div className="mx-auto max-w-6xl w-full space-y-4 p-4 sm:p-6">
      {/* 카테고리 탭 */}
      <div role="tablist" className="tabs tabs-bordered">
        {LODGING_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            className={`tab gap-1.5 ${category === cat ? "tab-active font-semibold" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {CATEGORY_ICONS[cat]}
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 검색 바 */}
        <aside className="w-full shrink-0 lg:w-72">
          <SearchBar
            city={city}
            onCityChange={setCity}
            subCity={subCity}
            onSubCityChange={setSubCity}
            checkIn={checkIn}
            onCheckInChange={setCheckIn}
            checkOut={checkOut}
            onCheckOutChange={setCheckOut}
            guests={guests}
            onGuestsChange={setGuests}
            onSearch={handleSearch}
            isSearching={isSearching}
            vertical
          />
        </aside>

        {/* 검색 결과 리스트 */}
        <main className="min-w-0 flex-1">
          <LodgingList lodgings={lodgings} isSearching={isSearching} hasSearched={hasSearched} />
        </main>
      </div>
    </div>
  )
}
