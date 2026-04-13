"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

import { PATH } from "@/constants/path"
import { useLodgingsQuery } from "@/hooks/queries/use-lodgings-query"
import type { SearchParams } from "@/types/search"

export const LODGING_CATEGORIES = [
  "전체",
  "관광호텔",
  "일반호텔",
  "여관업",
  "숙박업(생활)",
  "휴양콘도미니엄업",
  "숙박업 기타",
] as const

export type LodgingCategory = (typeof LODGING_CATEGORIES)[number]

export function useSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cityParam = searchParams.get("city") ?? ""
  const subCityParam = searchParams.get("subCity") ?? ""
  const checkInParam = searchParams.get("checkIn") ?? ""
  const checkOutParam = searchParams.get("checkOut") ?? ""
  const guestsParam = Number(searchParams.get("guests")) || 1

  const [city, setCity] = useState(cityParam)
  const [subCity, setSubCity] = useState(subCityParam)
  const [checkIn, setCheckIn] = useState(checkInParam)
  const [checkOut, setCheckOut] = useState(checkOutParam)
  const [guests, setGuests] = useState(guestsParam)
  const [category, setCategory] = useState<LodgingCategory>("전체")

  const queryParams: SearchParams | null =
    cityParam && checkInParam && checkOutParam
      ? {
          city: cityParam,
          subCity: subCityParam,
          checkIn: checkInParam,
          checkOut: checkOutParam,
          guests: guestsParam,
        }
      : null

  const lodgingsQuery = useLodgingsQuery(queryParams)

  const handleSearch = () => {
    if (!city || !checkIn || !checkOut) return

    const params = new URLSearchParams({
      city,
      checkIn,
      checkOut,
      guests: String(guests),
    })

    if (subCity) params.set("subCity", subCity)

    router.push(`${PATH.SEARCH}?${params.toString()}`)
  }

  const filteredLodgings = useMemo(() => {
    const all = lodgingsQuery.data ?? []
    const byGuests = all.filter(
      (item) => item.capacity.adults + item.capacity.children >= guestsParam && item.stock > 0
    )
    if (category === "전체") return byGuests
    return byGuests.filter((item) => item.type === category)
  }, [lodgingsQuery.data, category, guestsParam])

  return {
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
    lodgings: filteredLodgings,
    isSearching: lodgingsQuery.isLoading,
    hasSearched: !!queryParams,
  }
}
