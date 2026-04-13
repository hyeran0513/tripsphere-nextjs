"use client"

import { SearchBar } from "@/components/shared/feature/home/search-bar"
import { CityAccommodationSection } from "@/components/shared/feature/home/city-accommodation-section"
import { useSearchForm } from "@/hooks/home/use-search-form"

const CITY_SECTIONS = [
  { city: "서울", label: "서울 숙소" },
  { city: "부산", label: "부산 숙소" },
  { city: "전북", label: "전북 숙소" },
]

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
    <>
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

      {/* 도시별 숙소 리스트 */}
      <section className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        {CITY_SECTIONS.map((s) => (
          <CityAccommodationSection key={s.city} city={s.city} label={s.label} />
        ))}
      </section>
    </>
  )
}
