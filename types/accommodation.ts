const ACCOMMODATION_TYPE_LABELS: Record<string, string> = {
  hotel: "호텔",
  motel: "모텔",
  resort: "리조트",
  pension: "펜션",
  guesthouse: "게스트하우스",
  camping: "캠핑",
}

/** 영문 숙소 타입을 한글로 변환 */
export function getAccommodationTypeLabel(type: string): string {
  return ACCOMMODATION_TYPE_LABELS[type] ?? type
}

/** 한글 카테고리를 영문 타입으로 변환 */
export function getCategoryToType(category: string): string | null {
  const entry = Object.entries(ACCOMMODATION_TYPE_LABELS).find(([, label]) => label === category)
  return entry ? entry[0] : null
}

export type Accommodation = {
  id: string
  name: string
  description?: string
  type?: string
  review_count?: number
  total_rating?: number
  host?: {
    name?: string
    email?: string
    contact?: string
  }
  images?: string[]
  location?: {
    city?: string
    sub_city?: string
    place_name?: string
    latitude?: number
    longitude?: number
  }
}
