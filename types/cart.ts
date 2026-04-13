export type CartItem = {
  id: string
  lodging_id: string
  user_id: string
  created_at: string
  lodging?: {
    name: string
    price_point: number
    type?: string
    image?: string
  }
}
