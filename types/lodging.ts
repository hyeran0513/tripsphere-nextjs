/** 숙소 타입 라벨 (현재 데이터는 한글 그대로라 그대로 반환) */
export function getLodgingTypeLabel(type: string): string {
  return type
}

export type Lodging = {
  id: string
  name: string
  description?: string
  type?: string
  capacity: {
    adults: number
    children: number
  }
  host?: {
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
  price_point: number
  review_count?: number
  total_rating?: number
  stock: number
  source?: {
    license_id?: string
    tour_content_id?: string
  }
}
