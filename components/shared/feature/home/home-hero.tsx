"use client"

import { SearchBar } from "@/components/shared/feature/home/search-bar"
import { useSearchForm } from "@/hooks/home/use-search-form"

export function HomeHero() {
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
  } = useSearchForm()

  return (
    <section
      className="relative flex h-[60vh] flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg_hero.jpeg')" }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* 제목 */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl">어디로 떠나볼까요?</h1>
        </div>

        {/* 검색 바 */}
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
        />
      </div>
    </section>
  )
}
