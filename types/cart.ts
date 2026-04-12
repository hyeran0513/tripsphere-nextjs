export type CartItem = {
  id: string
  room_id: string
  user_id: string
  created_at: string
  room?: {
    name: string
    original_price: number
    discount_rate: number
    stay_type: string
    accommodation_name?: string
    image?: string
  }
}
