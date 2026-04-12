"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { PATH } from "@/constants/path"

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function useSearchForm() {
  const router = useRouter()

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [city, setCity] = useState("서울")
  const [subCity, setSubCity] = useState("")
  const [checkIn, setCheckIn] = useState(formatDate(today))
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow))
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
