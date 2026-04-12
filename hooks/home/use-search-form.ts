"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { PATH } from "@/constants/path"

export function useSearchForm() {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [subCity, setSubCity] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)

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
  }
}
