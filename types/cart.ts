export type CartItem = {
  id: string
  room_id: string
  user_id: string
  created_at: string
  room?: {
    name: string
    price_per_hour?: number
    price_per_night?: number
    accommodation_name?: string
    image?: string
  }
}
