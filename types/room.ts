export type Room = {
  id: string
  accommodation_id: string
  name: string
  type?: string
  description?: string
  images?: string[]
  capacity: {
    adults: number
    children: number
  }
  max_capacity: number
  size?: {
    m2?: number
    pyeong?: number
  }
  price_point: number
  original_price?: number
  discount_rate?: number
  services?: string[]
  stock: number
  availability?: Record<string, boolean>
}
