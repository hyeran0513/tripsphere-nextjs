"use client"

import { MapPin } from "lucide-react"

import { useCitiesQuery } from "@/hooks/queries/use-cities-query"

type RegionSelectProps = {
  city: string
  subCity: string
  onCityChange: (value: string) => void
  onSubCityChange: (value: string) => void
}

export function RegionSelect({ city, subCity, onCityChange, onSubCityChange }: RegionSelectProps) {
  const { data: cities = [], isLoading: isCitiesLoading } = useCitiesQuery()
  const selectedCity = cities.find((c) => c.name === city)
  const subCities = selectedCity?.subCities ?? []

  return (
    <div className="form-control min-w-0 flex-1">
      <label className="label py-0.5">
        <span className="label-text flex items-center gap-1 text-xs font-semibold">
          <MapPin className="size-3.5" />
          지역
        </span>
      </label>

      <div className="flex gap-2">
        {/* 지역 선택 필드 */}
        <select
          className="select select-bordered select-sm flex-1"
          value={city}
          onChange={(e) => {
            onCityChange(e.target.value)
            onSubCityChange("")
          }}
          disabled={isCitiesLoading}
        >
          <option value="">선택</option>
          {cities.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* 하위 지역 선택 필드 */}
        <select
          className="select select-bordered select-sm flex-1"
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
    </div>
  )
}
