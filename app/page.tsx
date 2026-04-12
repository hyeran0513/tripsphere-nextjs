"use client"

import { SearchBar } from "@/components/shared/feature/home/search-bar"
import { useSearchForm } from "@/hooks/home/use-search-form"

export default function Home() {
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
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg_hero.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl">어디로 떠나볼까요?</h1>
          <p className="mt-3 text-lg text-white/80">전국의 다양한 숙소를 검색하고 예약하세요</p>
        </div>

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
