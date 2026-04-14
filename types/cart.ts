export type CartItem = {
  id: string
  lodging_id: string
  user_id: string
  created_at: string
  lodging?: {
    name: string
    type?: string
    image?: string
  }
}
