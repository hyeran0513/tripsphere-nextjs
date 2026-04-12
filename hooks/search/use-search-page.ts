"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { PATH } from "@/constants/path"
import { useAccommodationsQuery } from "@/hooks/queries/use-accommodations-query"
import type { SearchParams } from "@/types/search"

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

  const accommodationsQuery = useAccommodationsQuery(queryParams)

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
    accommodations: accommodationsQuery.data ?? [],
    isSearching: accommodationsQuery.isLoading,
    hasSearched: !!queryParams,
  }
}
