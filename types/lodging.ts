export function getLodgingTypeLabel(type: string): string {
  return type
}

export type Lodging = {
  id: string
  name: string
  description?: string
  type?: string
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
  review_count?: number
  total_rating?: number
  source?: {
    license_id?: string
    tour_content_id?: string
  }
}
