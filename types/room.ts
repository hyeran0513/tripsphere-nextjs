export type Room = {
  id: string
  accommodation_id: string
  name: string
  description?: string
  capacity: {
    adults: number
    children: number
  }
  images?: string[]
  price_per_hour?: number
  price_per_night?: number
  remaining_rooms: number
}
