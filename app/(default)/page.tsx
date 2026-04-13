import { CityAccommodationSection } from "@/components/shared/feature/home/city-accommodation-section"
import { HomeHero } from "@/components/shared/feature/home/home-hero"

const CITY_SECTIONS = [
  { city: "서울", label: "서울 숙소" },
  { city: "부산", label: "부산 숙소" },
  { city: "전북", label: "전북 숙소" },
]

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* 도시별 숙소 리스트 */}
      <section className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        {CITY_SECTIONS.map((s) => (
          <CityAccommodationSection key={s.city} city={s.city} label={s.label} />
        ))}
      </section>
    </>
  )
}
