"use client"

import { AccommodationList } from "@/components/shared/feature/home/accommodation-list"
import { SearchBar } from "@/components/shared/feature/home/search-bar"
import { useSearchPage } from "@/hooks/search/use-search-page"

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
    accommodations,
    isSearching,
    hasSearched,
  } = useSearchPage()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex justify-center">
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
        />
      </div>

      <AccommodationList
        accommodations={accommodations}
        isSearching={isSearching}
        hasSearched={hasSearched}
      />
    </div>
  )
}
