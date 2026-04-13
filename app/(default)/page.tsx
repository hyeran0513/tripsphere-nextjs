import { CityLodgingSection } from "@/components/shared/feature/home/city-lodging-section"
import { HomeHero } from "@/components/shared/feature/home/home-hero"

const CITY_SECTIONS = [
  { city: "서울특별시", label: "서울 숙소" },
  { city: "부산광역시", label: "부산 숙소" },
  { city: "제주특별자치도", label: "제주 숙소" },
  { city: "강원특별자치도", label: "강원 숙소" },
]

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* 도시별 숙소 리스트 */}
      <section className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        {CITY_SECTIONS.map((s) => (
          <CityLodgingSection key={s.city} city={s.city} label={s.label} />
        ))}
      </section>
    </>
  )
}
