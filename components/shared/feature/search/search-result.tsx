"use client"

import { Building2, DoorOpen, Gem, Home, LayoutGrid, Tent, Users } from "lucide-react"

import { AccommodationList } from "@/components/shared/feature/home/accommodation-list"
import { SearchBar } from "@/components/shared/feature/home/search-bar"
import {
  ACCOMMODATION_CATEGORIES,
  type AccommodationCategory,
  useSearchPage,
} from "@/hooks/search/use-search-page"

const CATEGORY_ICONS: Record<AccommodationCategory, React.ReactNode> = {
  전체: <LayoutGrid className="size-4" />,
  호텔: <Building2 className="size-4" />,
  모텔: <DoorOpen className="size-4" />,
  리조트: <Gem className="size-4" />,
  펜션: <Home className="size-4" />,
  게스트하우스: <Users className="size-4" />,
  캠핑: <Tent className="size-4" />,
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
    accommodations,
    isSearching,
    hasSearched,
  } = useSearchPage()

  return (
    <div className="mx-auto max-w-6xl w-full space-y-4 p-4 sm:p-6">
      {/* 카테고리 탭 */}
      <div role="tablist" className="tabs tabs-bordered">
        {ACCOMMODATION_CATEGORIES.map((cat) => (
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

      {/* 좌측 검색 + 우측 목록 */}
      <div className="flex flex-col gap-6 lg:flex-row">
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

        <main className="min-w-0 flex-1">
          <AccommodationList
            accommodations={accommodations}
            isSearching={isSearching}
            hasSearched={hasSearched}
          />
        </main>
      </div>
    </div>
  )
}
