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
